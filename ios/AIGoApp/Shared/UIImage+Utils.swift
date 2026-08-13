// Adapted from KeyboardKit Demo (github.com/KeyboardKit/KeyboardKit)
// DemoActionHandler.swift — UIImage pasteboard & photo save utilities

import UIKit

public extension UIImage {

    /// Copy the image as PNG data to the given pasteboard.
    /// Returns false if PNG encoding fails.
    @discardableResult
    func copyToPasteboard(_ pasteboard: UIPasteboard = .general) -> Bool {
        guard let data = pngData() else { return false }
        pasteboard.setData(data, forPasteboardType: "public.png")
        return true
    }

    /// Save the image to the user's Photos library.
    func saveToPhotos(completion: @escaping (Error?) -> Void) {
        ImageSaveService.default.saveImageToPhotos(self, completion: completion)
    }
}

/// NSObject target required for `UIImageWriteToSavedPhotosAlbum`.
/// Adapted from KeyboardKit Demo — ImageService pattern.
private class ImageSaveService: NSObject {

    static let `default` = ImageSaveService()
    private var completions: [(Error?) -> Void] = []

    func saveImageToPhotos(_ image: UIImage, completion: @escaping (Error?) -> Void) {
        completions.append(completion)
        UIImageWriteToSavedPhotosAlbum(image, self, #selector(didFinish(_:error:contextInfo:)), nil)
    }

    @objc private func didFinish(_ image: UIImage, error: NSError?, contextInfo: UnsafeRawPointer) {
        guard !completions.isEmpty else { return }
        completions.removeFirst()(error)
    }
}
