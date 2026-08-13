import Foundation
import UIKit
import Photos

public final class PhotoLibraryMonitor {
    public static let shared = PhotoLibraryMonitor()
    private init() {}

    /// Fetch the most recent screenshot/photo from the user's Photos library.
    /// Request authorization if not determined yet.
    public func fetchLatestPhoto(completion: @escaping (UIImage?, Date?) -> Void) {
        let status = PHPhotoLibrary.authorizationStatus(for: .readWrite)

        if status == .authorized || status == .limited {
            loadLatestAsset(completion: completion)
        } else if status == .notDetermined {
            PHPhotoLibrary.requestAuthorization(for: .readWrite) { newStatus in
                if newStatus == .authorized || newStatus == .limited {
                    DispatchQueue.main.async {
                        self.loadLatestAsset(completion: completion)
                    }
                } else {
                    DispatchQueue.main.async {
                        completion(nil, nil)
                    }
                }
            }
        } else {
            completion(nil, nil)
        }
    }

    private func loadLatestAsset(completion: @escaping (UIImage?, Date?) -> Void) {
        let fetchOptions = PHFetchOptions()
        fetchOptions.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: false)]
        fetchOptions.fetchLimit = 1

        let fetchResult = PHAsset.fetchAssets(with: .image, options: fetchOptions)
        guard let asset = fetchResult.firstObject else {
            completion(nil, nil)
            return
        }

        let manager = PHImageManager.default()
        let options = PHImageRequestOptions()
        options.isSynchronous = false
        options.deliveryMode = .highQualityFormat
        options.isNetworkAccessAllowed = true

        manager.requestImage(
            for: asset,
            targetSize: CGSize(width: 1024, height: 1024),
            contentMode: .aspectFit,
            options: options
        ) { image, _ in
            DispatchQueue.main.async {
                completion(image, asset.creationDate)
            }
        }
    }
}
