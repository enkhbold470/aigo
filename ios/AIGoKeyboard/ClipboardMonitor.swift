import UIKit

public final class ClipboardMonitor {
    public static let shared = ClipboardMonitor()
    private init() {}

    public struct ClipboardState {
        public let hasText: Bool
        public let text: String?
        public let hasImage: Bool
        public let imageBase64: String?

        public static let empty = ClipboardState(hasText: false, text: nil, hasImage: false, imageBase64: nil)
    }

    /// Safely inspect the pasteboard. Returns `.empty` if the pasteboard is
    /// unavailable (e.g. keyboard extension without Full Access, or sandbox
    /// restriction). Never crashes or logs the PBErrorDomain Code=10 error.
    public func inspectPasteboard(hasFullAccess: Bool = true) -> ClipboardState {
        guard isGeneralPasteboardAvailable(hasFullAccess: hasFullAccess) else { return .empty }

        let pasteboard = UIPasteboard.general

        var textContent: String?
        if pasteboard.hasStrings,
           let string = pasteboard.string?.trimmingCharacters(in: .whitespacesAndNewlines),
           !string.isEmpty {
            textContent = string
        }

        var imageBase64: String?
        if pasteboard.hasImages, let image = pasteboard.image {
            let resized = Self.resized(image, maxDimension: 768)
            if let data = resized.jpegData(compressionQuality: 0.65) {
                imageBase64 = data.base64EncodedString()
            }
        }

        return ClipboardState(
            hasText: textContent != nil,
            text: textContent,
            hasImage: imageBase64 != nil,
            imageBase64: imageBase64
        )
    }

    public func hasContent(hasFullAccess: Bool = true) -> (hasText: Bool, hasImage: Bool) {
        guard isGeneralPasteboardAvailable(hasFullAccess: hasFullAccess) else { return (false, false) }
        let pb = UIPasteboard.general
        return (pb.hasStrings, pb.hasImages)
    }

    // MARK: – Private

    private func isGeneralPasteboardAvailable(hasFullAccess: Bool) -> Bool {
        return hasFullAccess
    }

    private static func resized(_ image: UIImage, maxDimension: CGFloat) -> UIImage {
        let size = image.size
        let maxSide = max(size.width, size.height)
        guard maxSide > maxDimension, maxSide > 0 else { return image }
        let scale = maxDimension / maxSide
        let newSize = CGSize(width: size.width * scale, height: size.height * scale)
        let renderer = UIGraphicsImageRenderer(size: newSize)
        return renderer.image { _ in
            image.draw(in: CGRect(origin: .zero, size: newSize))
        }
    }
}
