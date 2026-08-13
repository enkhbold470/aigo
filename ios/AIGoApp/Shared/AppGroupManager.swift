import Foundation

public final class AppGroupManager {
    public static let shared = AppGroupManager()
    public static let appGroupID = "group.com.aigo.keyboard"

    private let defaults: UserDefaults

    private init() {
        defaults = UserDefaults(suiteName: AppGroupManager.appGroupID) ?? .standard
    }

    public var apiBaseURL: String {
        get { defaults.string(forKey: "api_base_url") ?? "http://192.168.0.49:5173" }
        set { defaults.set(newValue, forKey: "api_base_url") }
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
            "flirtLevel": flirtLevel
        ]
    }
}
