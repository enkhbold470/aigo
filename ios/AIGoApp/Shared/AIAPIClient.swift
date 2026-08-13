import Foundation

// MARK: – Response models used by AIAPIClient
struct RizzResponsePayload: Decodable {
    let suggestions: [RizzItem]?
    let options: [String]?
}

public final class AIAPIClient {
    public static let shared = AIAPIClient()
    private init() {}

    private var baseURL: String {
        AppGroupManager.shared.apiBaseURL.trimmingCharacters(in: CharacterSet(charactersIn: "/"))
    }

    public func transformText(
        text: String,
        action: String = "fix",
        customPrompt: String? = nil,
        completion: @escaping (Result<String, Error>) -> Void
    ) {
        post(path: "/api/ai/transform", body: [
            "text": text,
            "action": action,
            "customPrompt": customPrompt ?? ""
        ], decode: TransformResult.self) { result in
            switch result {
            case .success(let payload):
                completion(.success(payload.transformedText))
            case .failure:
                completion(.success(Self.localTransform(text: text, action: action)))
            }
        }
    }

    public func analyzeClipboard(
        text: String,
        context: String = "",
        completion: @escaping (Result<[SmartReplySuggestion], Error>) -> Void
    ) {
        post(path: "/api/ai/clipboard", body: [
            "text": text,
            "context": context
        ], decode: ClipboardAnalysisResult.self) { result in
            switch result {
            case .success(let payload):
                completion(.success(payload.suggestions))
            case .failure:
                completion(.success(Self.localClipboard(text: text)))
            }
        }
    }

    public func analyzeScreenshot(
        base64Image: String,
        tone: String = "friendly & direct",
        completion: @escaping (Result<[SmartReplySuggestion], Error>) -> Void
    ) {
        post(path: "/api/ai/screenshot", body: [
            "imageBase64": base64Image,
            "tone": tone
        ], decode: ScreenshotAnalysisResult.self, timeout: 20) { result in
            switch result {
            case .success(let payload):
                completion(.success(payload.suggestions))
            case .failure:
                completion(.success(Self.localScreenshot()))
            }
        }
    }

    public func completePhrase(
        before: String,
        after: String = "",
        completion: @escaping (Result<[SmartReplySuggestion], Error>) -> Void
    ) {
        post(path: "/api/ai/complete", body: [
            "before": before,
            "after": after
        ], decode: CompleteResult.self) { result in
            switch result {
            case .success(let payload):
                completion(.success(payload.suggestions))
            case .failure:
                completion(.success([
                    SmartReplySuggestion(label: "thanks", text: " thanks!"),
                    SmartReplySuggestion(label: "works", text: " that works for me.")
                ]))
            }
        }
    }

    /// Generate 3 all-lowercase, emoji-rich rizz messages with tone categories from an image and/or text context.
    public func generateRizz(
        imageBase64: String?,
        context: String = "",
        completion: @escaping (Result<[RizzItem], Error>) -> Void
    ) {
        var body: [String: Any] = [
            "context": context,
            "personalization": AppGroupManager.shared.personalizationDictionary
        ]
        if let img = imageBase64 { body["imageBase64"] = img }
        post(path: "/api/ai/rizz", body: body, decode: RizzResponsePayload.self, timeout: 20) { result in
            switch result {
            case .success(let payload):
                if let suggestions = payload.suggestions, !suggestions.isEmpty {
                    completion(.success(suggestions))
                } else if let options = payload.options {
                    let tones = ["Friendly", "Playful tease", "Bold"]
                    let items = options.enumerated().map { index, text in
                        let tone = index < tones.count ? tones[index] : "Suggestion"
                        return RizzItem(tone: tone, text: text)
                    }
                    completion(.success(items))
                } else {
                    completion(.success(Self.localRizzItems()))
                }
            case .failure:
                completion(.success(Self.localRizzItems()))
            }
        }
    }

    private func post<T: Decodable>(
        path: String,
        body: [String: Any],
        decode: T.Type,
        timeout: TimeInterval = 12,
        completion: @escaping (Result<T, Error>) -> Void
    ) {
        guard let url = URL(string: baseURL + path) else {
            completion(.failure(NSError(domain: "AIAPIClient", code: 400)))
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.timeoutInterval = timeout
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)

        URLSession.shared.dataTask(with: request) { data, _, error in
            let dispatchResult = { (res: Result<T, Error>) in
                DispatchQueue.main.async { completion(res) }
            }
            if let error {
                dispatchResult(.failure(error))
                return
            }
            guard let data else {
                dispatchResult(.failure(NSError(domain: "AIAPIClient", code: 204)))
                return
            }
            do {
                let decoded = try JSONDecoder().decode(T.self, from: data)
                dispatchResult(.success(decoded))
            } catch {
                dispatchResult(.failure(error))
            }
        }.resume()
    }

    private static func localRizzItems() -> [RizzItem] {
        [
            RizzItem(tone: "Friendly", text: "there's only one way to find out"),
            RizzItem(tone: "Playful tease", text: "i do, but you're gonna have to convince me you're worth my effort"),
            RizzItem(tone: "Bold", text: "i'd love to show you just how well i can")
        ]
    }

    private static func localTransform(text: String, action: String) -> String {
        switch action {
        case "formal":
            return "Hi — \(text) Please let me know if that works."
        case "shorter", "concise":
            return String(text.prefix(80))
        case "witty":
            return text + " 😉"
        default:
            return text.prefix(1).uppercased() + text.dropFirst()
        }
    }

    private static func localClipboard(text: String) -> [SmartReplySuggestion] {
        [
            SmartReplySuggestion(label: "Acknowledge", text: "Got it — I'll take care of this."),
            SmartReplySuggestion(label: "Reply later", text: "Thanks, I'll review this shortly."),
            SmartReplySuggestion(label: "Ask detail", text: "Could you share a bit more about \"\(text.prefix(20))\"?")
        ]
    }

    private static func localScreenshot() -> [SmartReplySuggestion] {
        [
            SmartReplySuggestion(label: "Confirm", text: "Sounds good — that time works for me.", tone: "enthusiastic"),
            SmartReplySuggestion(label: "Reschedule", text: "Could we shift this by 30 minutes?", tone: "polite"),
            SmartReplySuggestion(label: "Decline", text: "I can't make that one — another time?", tone: "respectful")
        ]
    }
}
