import SwiftUI
import UIKit

class KeyboardViewController: UIInputViewController, UIInputViewAudioFeedback {
    private let session = KeyboardSession()
    private var hostingController: UIHostingController<AIGoKeyboardView>?

    var enableInputClicksWhenVisible: Bool { true }

    override func viewDidLoad() {
        super.viewDidLoad()
        session.inputVC = self
        view.backgroundColor = UIColor.systemGray6
        setupKeyboard()
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        session.inputVC = self
    }

    private func setupKeyboard() {
        let root = AIGoKeyboardView(session: session)
        let hosting = UIHostingController(rootView: root)
        hosting.view.translatesAutoresizingMaskIntoConstraints = false
        hosting.view.backgroundColor = .clear
        addChild(hosting)
        view.addSubview(hosting.view)
        NSLayoutConstraint.activate([
            hosting.view.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            hosting.view.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            hosting.view.topAnchor.constraint(equalTo: view.topAnchor),
            hosting.view.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
        hosting.didMove(toParent: self)
        hostingController = hosting
    }

    override func viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
        // Taller panel — no keys, just the AI rizz panel
        let target: CGFloat = 300
        if view.constraints.first(where: { $0.identifier == "AIGoHeight" }) == nil {
            let c = view.heightAnchor.constraint(equalToConstant: target)
            c.identifier = "AIGoHeight"
            c.priority = UILayoutPriority(999)
            c.isActive = true
        }
    }
}
