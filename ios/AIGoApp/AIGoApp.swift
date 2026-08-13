import SwiftUI

@main
struct AIGoApp: App {
    @State private var showCamera = false

    var body: some Scene {
        WindowGroup {
            ContentView(showCamera: $showCamera)
                .onOpenURL { url in
                    if url.scheme == "aigo" && url.host == "camera" {
                        showCamera = true
                    }
                }
        }
    }
}
