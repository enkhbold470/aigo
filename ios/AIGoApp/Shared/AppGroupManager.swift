import Foundation
import Security

public final class AppGroupManager {
    public static let shared = AppGroupManager()
    public static let appGroupID = "group.com.aigo.keyboard"

    private let defaults: UserDefaults

    private init() {
        defaults = UserDefaults(suiteName: AppGroupManager.appGroupID) ?? .standard
    }

    public var apiBaseURL: String {
        get { defaults.string(forKey: "api_base_url") ?? "https://aigo-vert.vercel.app" }
        set { defaults.set(newValue, forKey: "api_base_url") }
    }

    // MARK: – Device Identity (persisted in Keychain for reinstall survival)
    public var deviceId: String {
        get {
            if let existing = KeychainHelper.get("deviceId") {
                return existing
            }
            let newId = UUID().uuidString
            KeychainHelper.set(newId, forKey: "deviceId")
            return newId
        }
    }

    // MARK: – Personalization Settings
    public var gender: String {
        get { defaults.string(forKey: "user_gender") ?? "Male" }
        set { defaults.set(newValue, forKey: "user_gender") }
    }

    public var sexuality: String {
        get { defaults.string(forKey: "user_sexuality") ?? "Straight" }
        set { defaults.set(newValue, forKey: "user_sexuality") }
    }

    public var age: Int {
        get {
            let val = defaults.integer(forKey: "user_age")
            return val > 0 ? val : 22
        }
        set { defaults.set(newValue, forKey: "user_age") }
    }

    public var intent: String {
        get { defaults.string(forKey: "user_intent") ?? "Fun & Hookup" }
        set { defaults.set(newValue, forKey: "user_intent") }
    }

    public var platform: String {
        get { defaults.string(forKey: "user_platform") ?? "iMessage" }
        set { defaults.set(newValue, forKey: "user_platform") }
    }

    public var casingStyle: String {
        get { defaults.string(forKey: "user_casing") ?? "all lowercase" }
        set { defaults.set(newValue, forKey: "user_casing") }
    }

    public var toneStyle: String {
        get { defaults.string(forKey: "user_tone") ?? "Brainrot / Gen-Z Slang" }
        set { defaults.set(newValue, forKey: "user_tone") }
    }

    public var flirtLevel: Int {
        get {
            let val = defaults.integer(forKey: "user_flirt_level")
            return val > 0 ? val : 3
        }
        set { defaults.set(newValue, forKey: "user_flirt_level") }
    }

    public var personalizationDictionary: [String: Any] {
        [
            "gender": gender,
            "sexuality": sexuality,
            "age": age,
            "intent": intent,
            "platform": platform,
            "casingStyle": casingStyle,
            "toneStyle": toneStyle,
            "flirtLevel": flirtLevel,
            "deviceId": deviceId
        ]
    }
}

// MARK: - Keychain Helper
private enum KeychainHelper {
    static func set(_ value: String, forKey key: String) {
        let data = value.data(using: .utf8)!
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecAttrService as String: AppGroupManager.appGroupID,
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlock
        ]
        SecItemDelete(query as CFDictionary)
        SecItemAdd(query as CFDictionary, nil)
    }

    static func get(_ key: String) -> String? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecAttrService as String: AppGroupManager.appGroupID,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        guard status == errSecSuccess, let data = result as? Data else { return nil }
        return String(data: data, encoding: .utf8)
    }
}
