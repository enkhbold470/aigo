import Combine
import UIKit

final class KeyboardSession: ObservableObject {
    weak var inputVC: UIInputViewController?

    var proxy: UITextDocumentProxy? { inputVC?.textDocumentProxy }

    var hasFullAccess: Bool {
        #if targetEnvironment(simulator)
        return true
        #else
        return inputVC?.hasFullAccess ?? false
        #endif
    }

    var needsGlobe: Bool { true }

    func insert(_ text: String) {
        playClick()
        proxy?.insertText(text)
    }

    func deleteBackward() {
        playClick()
        proxy?.deleteBackward()
    }

    func newline() { insert("\n") }

    func nextKeyboard() { inputVC?.advanceToNextInputMode() }

    /// Open a URL from the keyboard extension (e.g. aigo://camera).
    /// Returns true if the URL was dispatched.
    @discardableResult
    func openURL(_ url: URL) -> Bool {
        // Keyboard extensions can't call UIApplication.shared.open directly.
        // UIApplication.shared is unavailable in extensions.
        // extensionContext.open() is the correct API for opening URLs from any extension.
        inputVC?.extensionContext?.open(url, completionHandler: nil)
        return true
    }


    func contextBefore() -> String { proxy?.documentContextBeforeInput ?? "" }
    func contextAfter() -> String  { proxy?.documentContextAfterInput ?? "" }

    func replaceContextBefore(with newText: String) {
        guard let proxy else { return }
        let current = proxy.documentContextBeforeInput ?? ""
        for _ in current { proxy.deleteBackward() }
        proxy.insertText(newText)
    }

    func deleteSuffix(_ suffix: String) {
        guard let proxy else { return }
        for _ in suffix { proxy.deleteBackward() }
    }

    private func playClick() { UIDevice.current.playInputClick() }
}
