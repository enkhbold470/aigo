import Foundation

public struct SmartReplySuggestion: Codable, Identifiable, Hashable {
    public var id: String { "\(label)|\(text)" }
    public let label: String
    public let text: String
    public let icon: String?
    public let tone: String?

    public init(label: String, text: String, icon: String? = nil, tone: String? = nil) {
        self.label = label
        self.text = text
        self.icon = icon
        self.tone = tone
    }
}

public struct ClipboardAnalysisResult: Codable {
    public let summary: String?
    public let contentType: String?
    public let suggestions: [SmartReplySuggestion]
    public let simulated: Bool?
}

public struct ScreenshotAnalysisResult: Codable {
    public let detectedContext: String?
    public let suggestions: [SmartReplySuggestion]
    public let simulated: Bool?
}

public struct TransformResult: Codable {
    public let transformedText: String
    public let originalText: String?
    public let action: String?
    public let simulated: Bool?
}

public struct CompleteResult: Codable {
    public let suggestions: [SmartReplySuggestion]
    public let simulated: Bool?
}

public struct CustomPromptShortcut: Codable, Identifiable, Hashable {
    public let id: String
    public let shortcut: String
    public let title: String
    public let systemPrompt: String

    public init(id: String = UUID().uuidString, shortcut: String, title: String, systemPrompt: String) {
        self.id = id
        self.shortcut = shortcut
        self.title = title
        self.systemPrompt = systemPrompt
    }
}

public struct SnippetItem: Codable, Identifiable, Hashable {
    public let id: String
    public let title: String
    public let content: String
    public let category: String?

    public init(id: String = UUID().uuidString, title: String, content: String, category: String? = nil) {
        self.id = id
        self.title = title
        self.content = content
        self.category = category
    }
}

public struct RizzItem: Codable, Identifiable, Hashable {
    public var id: String { "\(tone)|\(text)" }
    public let tone: String
    public let text: String

    public init(tone: String, text: String) {
        self.tone = tone
        self.text = text
    }
}

