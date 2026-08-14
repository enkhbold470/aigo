export interface RizzDocument {
	id: string;
	text: string;
	tone: 'Friendly' | 'Playful tease' | 'Bold' | 'Smooth' | 'Unhinged' | 'Brainrot' | string;
	category:
		| 'Cooking'
		| 'Travel'
		| 'Hobbies'
		| 'Gym/Fitness'
		| 'Music'
		| 'Work/Tech'
		| 'Bad Texters'
		| 'Self-deprecating humor'
		| 'Photo reactions'
		| 'Questions'
		| 'Late night texts'
		| 'IG story replies'
		| string;
	intent: 'Casual Date' | 'Fun & Hookup' | 'A Relationship' | 'Neutral' | string;
	contextKeywords: string[];
	embedding?: number[];
}

export const RIZZ_KNOWLEDGE_BASE: RizzDocument[] = [
	// ==========================================
	// 1. COOKING & FOOD (15 items)
	// ==========================================
	{
		id: 'cook-001',
		text: 'On a scale from "microwaves cereal" to "Gordon Ramsay", how much supervision do you need in the kitchen?',
		tone: 'Playful tease',
		category: 'Cooking',
		intent: 'Casual Date',
		contextKeywords: ['cooking', 'food', 'chef', 'gordon ramsay', 'kitchen', 'dinner', 'dinner date', 'baking', 'culinary']
	},
	{
		id: 'cook-002',
		text: 'I make a pasta dish that has a 100% track record of securing a second date. You willing to put that statistic to the test?',
		tone: 'Smooth',
		category: 'Cooking',
		intent: 'Casual Date',
		contextKeywords: ['pasta', 'italian', 'dinner', 'cooking', 'date night', 'food', 'homemade', 'wine']
	},
	{
		id: 'cook-003',
		text: 'If that food tastes even half as good as it looks, you owe me a cooking masterclass this weekend.',
		tone: 'Friendly',
		category: 'Cooking',
		intent: 'Casual Date',
		contextKeywords: ['foodie', 'recipe', 'cooking', 'ig story', 'delicious', 'masterclass', 'weekend plans']
	},
	{
		id: 'cook-004',
		text: 'I will literally do the dishes, prep the garlic, and be your personal sous-chef if you make that for me.',
		tone: 'Playful tease',
		category: 'Cooking',
		intent: 'A Relationship',
		contextKeywords: ['sous chef', 'dishes', 'cooking together', 'food', 'relationship goals', 'meal prep', 'homemade']
	},
	{
		id: 'cook-005',
		text: 'Tell me your ultimate comfort food so I know what to order when you are having an off day.',
		tone: 'Friendly',
		category: 'Cooking',
		intent: 'A Relationship',
		contextKeywords: ['comfort food', 'care', 'sweet', 'dinner', 'food delivery', 'thoughtful', 'relationship']
	},
	{
		id: 'cook-006',
		text: 'That plate looks dangerous. Either you are a secret Michelin-star chef or you are trying to hypnotize me through my screen.',
		tone: 'Smooth',
		category: 'Cooking',
		intent: 'Fun & Hookup',
		contextKeywords: ['michelin star', 'hypnotize', 'food photo', 'gourmet', 'sexy', 'dinner', 'flirty']
	},
	{
		id: 'cook-007',
		text: 'I burn toast on purpose because I like the emotional damage, but for you I would master French cuisine.',
		tone: 'Unhinged',
		category: 'Cooking',
		intent: 'Fun & Hookup',
		contextKeywords: ['burnt toast', 'french cuisine', 'funny', 'chaotic', 'cooking fail', 'unhinged rizz']
	},
	{
		id: 'cook-008',
		text: 'Whoever let you cook like that unlocked infinite aura and 5-star Ohio rizz.',
		tone: 'Brainrot',
		category: 'Cooking',
		intent: 'Neutral',
		contextKeywords: ['aura', 'ohio', 'let him cook', 'rizz', 'brainrot', 'tiktok slang', 'food hype']
	},
	{
		id: 'cook-009',
		text: 'Dinner at my place: I cook, you curate the playlist, and we pretend to understand the wine tasting notes.',
		tone: 'Smooth',
		category: 'Cooking',
		intent: 'Casual Date',
		contextKeywords: ['dinner date', 'wine', 'playlist', 'home cooking', 'cozy date', 'flirtatious', 'invitation']
	},
	{
		id: 'cook-010',
		text: 'Controversial take: pineapple on pizza is either a crime against humanity or high art. Which side of history are you on?',
		tone: 'Playful tease',
		category: 'Cooking',
		intent: 'Neutral',
		contextKeywords: ['pineapple on pizza', 'food debate', 'icebreaker', 'fun banter', 'pizza', 'opinions']
	},
	{
		id: 'cook-011',
		text: 'You look like the type of person who claims they don’t want fries, but then steals 70% of mine.',
		tone: 'Playful tease',
		category: 'Cooking',
		intent: 'Casual Date',
		contextKeywords: ['french fries', 'food thief', 'banter', 'restaurant', 'tease', 'cute debate']
	},
	{
		id: 'cook-012',
		text: 'Skip the small talk: pick a pastry and a coffee, and I’ll have them delivered or we go together tomorrow morning.',
		tone: 'Bold',
		category: 'Cooking',
		intent: 'Casual Date',
		contextKeywords: ['coffee date', 'croissant', 'bakery', 'bold move', 'breakfast', 'morning date']
	},
	{
		id: 'cook-013',
		text: 'I don’t know what smells better—that dish or the intoxicating vibe of someone who actually knows how to season food.',
		tone: 'Smooth',
		category: 'Cooking',
		intent: 'Fun & Hookup',
		contextKeywords: ['seasoning', 'spices', 'cooking sexy', 'chemistry', 'aroma', 'food attraction']
	},
	{
		id: 'cook-014',
		text: 'Let me take you to the best taco spot in the city. If it is not life-changing, your next drink is entirely on me.',
		tone: 'Bold',
		category: 'Cooking',
		intent: 'Casual Date',
		contextKeywords: ['tacos', 'street food', 'hidden gem', 'bet', 'confident', 'casual date']
	},
	{
		id: 'cook-015',
		text: 'I cook 3 things: avocado toast, spicy ramen with an egg, and unforgettable first impressions.',
		tone: 'Playful tease',
		category: 'Cooking',
		intent: 'Casual Date',
		contextKeywords: ['ramen', 'avocado toast', 'cocky', 'witty', 'starter', 'humor', 'impress']
	},

	// ==========================================
	// 2. TRAVEL & WANDERLUST (14 items)
	// ==========================================
	{
		id: 'trav-001',
		text: 'If we were running to catch a flight, are you sprinting through the terminal barefoot or casually grabbing an iced latte?',
		tone: 'Playful tease',
		category: 'Travel',
		intent: 'Casual Date',
		contextKeywords: ['airport', 'travel vibe', 'flight', 'terminal', 'iced latte', 'vacation', 'personality']
	},
	{
		id: 'trav-002',
		text: 'Your vacation photos belong on a travel magazine cover. Are you taking applications for a travel buddy yet?',
		tone: 'Smooth',
		category: 'Travel',
		intent: 'A Relationship',
		contextKeywords: ['travel partner', 'wanderlust', 'vacation', 'aesthetic', 'scenery', 'passport', 'globe']
	},
	{
		id: 'trav-003',
		text: 'Tell me the sketchiest hostel story or biggest travel disaster you have survived—I need to gauge your adaptability.',
		tone: 'Friendly',
		category: 'Travel',
		intent: 'Neutral',
		contextKeywords: ['hostel', 'travel story', 'adventure', 'backpacking', 'story starter', 'funny story']
	},
	{
		id: 'trav-004',
		text: 'Window seat or aisle seat? Choose carefully, your answer determines our compatibility for the next 5 years.',
		tone: 'Playful tease',
		category: 'Travel',
		intent: 'A Relationship',
		contextKeywords: ['airplane', 'window seat', 'aisle seat', 'compatibility', 'travel test', 'witty']
	},
	{
		id: 'trav-005',
		text: 'Forget 5-year career plans. Where is the one spontaneous destination you would book a one-way ticket to right now?',
		tone: 'Friendly',
		category: 'Travel',
		intent: 'Casual Date',
		contextKeywords: ['one-way ticket', 'spontaneous', 'dream trip', 'bucket list', 'escapism', 'explore']
	},
	{
		id: 'trav-006',
		text: 'That view looks almost as stunning as the person standing in front of it.',
		tone: 'Smooth',
		category: 'Travel',
		intent: 'Fun & Hookup',
		contextKeywords: ['sunset', 'mountain view', 'beach view', 'photo reaction', 'compliment', 'flirt']
	},
	{
		id: 'trav-007',
		text: 'I will spontaneously buy tickets to Tokyo right now if you promise we will get lost in Golden Gai together.',
		tone: 'Bold',
		category: 'Travel',
		intent: 'Fun & Hookup',
		contextKeywords: ['tokyo', 'japan', 'golden gai', 'bold rizz', 'adventure', 'spontaneous trip']
	},
	{
		id: 'trav-008',
		text: 'Bro got that geopolitical gyatt passport rizz skibidi in Rome fr fr.',
		tone: 'Brainrot',
		category: 'Travel',
		intent: 'Neutral',
		contextKeywords: ['brainrot', 'skibidi', 'passport', 'rome', 'tiktok', 'gen z humor']
	},
	{
		id: 'trav-009',
		text: 'Are you the itinerary planner who schedules every 15-minute window or the "let us wake up at noon and wander" tourist?',
		tone: 'Friendly',
		category: 'Travel',
		intent: 'Neutral',
		contextKeywords: ['itinerary', 'vacation style', 'planner', 'wandering', 'travel debate', 'icebreaker']
	},
	{
		id: 'trav-010',
		text: 'I’m willing to be the designated luggage carrier if you handle navigation, deal?',
		tone: 'Smooth',
		category: 'Travel',
		intent: 'A Relationship',
		contextKeywords: ['luggage', 'teamwork', 'navigation', 'cute deal', 'travel couple', 'partner']
	},
	{
		id: 'trav-011',
		text: 'My internal compass is so broken I could get lost in an elevator, so you are definitely leading the expedition.',
		tone: 'Self-deprecating humor',
		category: 'Travel',
		intent: 'Casual Date',
		contextKeywords: ['lost', 'directionally challenged', 'compass', 'funny', 'humble', 'date idea']
	},
	{
		id: 'trav-012',
		text: 'That landscape looks unreal. What was the soundtrack playing in your earbuds while you were standing there?',
		tone: 'Friendly',
		category: 'Travel',
		intent: 'Neutral',
		contextKeywords: ['soundtrack', 'earbuds', 'vibe', 'landscape', 'cinematic', 'deep question']
	},
	{
		id: 'trav-013',
		text: 'I pack 10 minutes before the Uber arrives and somehow forget socks every single time. Please tell me you are more civilized.',
		tone: 'Playful tease',
		category: 'Travel',
		intent: 'Casual Date',
		contextKeywords: ['packing', 'uber', 'last minute', 'chaotic travel', 'funny admission']
	},
	{
		id: 'trav-014',
		text: 'We should find a rooftop bar that gives us this exact sunset energy this Thursday.',
		tone: 'Bold',
		category: 'Travel',
		intent: 'Casual Date',
		contextKeywords: ['rooftop bar', 'sunset', 'thursday date', 'direct invite', 'vacation vibe']
	},

	// ==========================================
	// 3. HOBBIES, GAMING & CREATIVITY (14 items)
	// ==========================================
	{
		id: 'hob-001',
		text: 'Are you carrying the squad or are you the one screaming in the Discord voice channel asking where the revive button is?',
		tone: 'Playful tease',
		category: 'Hobbies',
		intent: 'Casual Date',
		contextKeywords: ['gaming', 'discord', 'gamer', 'squad', 'revive', 'video games', 'banter']
	},
	{
		id: 'hob-002',
		text: '1v1 me. If I win, I buy you drinks. If you win, you have to let me buy you drinks.',
		tone: 'Smooth',
		category: 'Hobbies',
		intent: 'Casual Date',
		contextKeywords: ['1v1', 'gamer rizz', 'win win', 'flirty bet', 'drinks date', 'video games']
	},
	{
		id: 'hob-003',
		text: 'What is a niche hobby or hyperfixation you could give an unfiltered 45-minute TED Talk on without any slides?',
		tone: 'Friendly',
		category: 'Hobbies',
		intent: 'Neutral',
		contextKeywords: ['ted talk', 'hyperfixation', 'passion', 'niche hobby', 'deep conversation', 'icebreaker']
	},
	{
		id: 'hob-004',
		text: 'Show me your bookshelf and I will accurately predict your entire psychological profile within 30 seconds.',
		tone: 'Playful tease',
		category: 'Hobbies',
		intent: 'Casual Date',
		contextKeywords: ['books', 'reading', 'bookshelf', 'psychological profile', 'bookworm', 'intellectual rizz']
	},
	{
		id: 'hob-005',
		text: 'Your taste in art and design is immaculate. Did you study this or were you just born with absurd aesthetic taste?',
		tone: 'Smooth',
		category: 'Hobbies',
		intent: 'A Relationship',
		contextKeywords: ['art', 'design', 'aesthetic', 'museum', 'gallery', 'flattery', 'high taste']
	},
	{
		id: 'hob-006',
		text: 'I bought watercolor paints thinking I’d be Picasso, and I ended up painting what looks like a bruised avocado.',
		tone: 'Self-deprecating humor',
		category: 'Hobbies',
		intent: 'Neutral',
		contextKeywords: ['painting', 'art fail', 'picasso', 'avocado', 'humor', 'creative hobby']
	},
	{
		id: 'hob-007',
		text: 'If we play Mario Kart and you hit me with a Blue Shell right before the finish line, our wedding is canceled.',
		tone: 'Playful tease',
		category: 'Hobbies',
		intent: 'A Relationship',
		contextKeywords: ['mario kart', 'blue shell', 'gaming', 'wedding joke', 'nintendo', 'playful']
	},
	{
		id: 'hob-008',
		text: 'Bro has maximum level 100 Kai Cenat rizz streaming directly from the mainframe.',
		tone: 'Brainrot',
		category: 'Hobbies',
		intent: 'Neutral',
		contextKeywords: ['kai cenat', 'streaming', 'twitch', 'brainrot', 'level 100', 'gamer']
	},
	{
		id: 'hob-009',
		text: 'I challenge you to a museum date: we walk through modern art and make up completely absurd pretentious backstories for every piece.',
		tone: 'Friendly',
		category: 'Hobbies',
		intent: 'Casual Date',
		contextKeywords: ['museum date', 'modern art', 'pretentious', 'fun date', 'creative', 'gallery']
	},
	{
		id: 'hob-010',
		text: 'The film photos you take are incredible. Do you shoot 35mm or are you just blessed with cinematic lighting everywhere you go?',
		tone: 'Smooth',
		category: 'Hobbies',
		intent: 'Casual Date',
		contextKeywords: ['film photography', '35mm', 'analog', 'cinematic', 'camera', 'photo compliment']
	},
	{
		id: 'hob-011',
		text: 'My guitar skills are limited to playing the first 4 chords of Wonderwall very loudly until everyone leaves the room.',
		tone: 'Self-deprecating humor',
		category: 'Hobbies',
		intent: 'Neutral',
		contextKeywords: ['guitar', 'wonderwall', 'instruments', 'self burn', 'musician joke']
	},
	{
		id: 'hob-012',
		text: 'You have that quiet creative genius energy that makes people want to sit in silence with you while you make cool stuff.',
		tone: 'Smooth',
		category: 'Hobbies',
		intent: 'A Relationship',
		contextKeywords: ['creative genius', 'comfort', 'deep connection', 'artistic', 'calm vibe']
	},
	{
		id: 'hob-013',
		text: 'Board game night rule #1: I am extremely competitive, but I will let you win if you promise to look cute gloating about it.',
		tone: 'Bold',
		category: 'Hobbies',
		intent: 'Fun & Hookup',
		contextKeywords: ['board games', 'catan', 'monopoly', 'competitive', 'flirtatious', 'game night']
	},
	{
		id: 'hob-014',
		text: 'Let’s go thrifting. We have $20 each to assemble the most outrageously high-fashion outfit for the other person to wear.',
		tone: 'Friendly',
		category: 'Hobbies',
		intent: 'Casual Date',
		contextKeywords: ['thrifting', 'vintage', 'fashion challenge', 'fun date idea', 'secondhand']
	},

	// ==========================================
	// 4. GYM & FITNESS (14 items)
	// ==========================================
	{
		id: 'gym-001',
		text: 'Drop the workout routine immediately because whatever you are doing is doing wonders.',
		tone: 'Bold',
		category: 'Gym/Fitness',
		intent: 'Fun & Hookup',
		contextKeywords: ['workout', 'gym', 'gains', 'physique', 'flirty', 'fitness', 'fit']
	},
	{
		id: 'gym-002',
		text: 'Are you trying to hit a new PR on the bench press or are you just trying to break hearts at 7 AM?',
		tone: 'Playful tease',
		category: 'Gym/Fitness',
		intent: 'Fun & Hookup',
		contextKeywords: ['bench press', 'PR', 'gym crush', 'fitness', 'heartbreaker', 'morning workout']
	},
	{
		id: 'gym-003',
		text: 'I just finished leg day and currently walk like a newly birthed baby giraffe. Need moral support.',
		tone: 'Self-deprecating humor',
		category: 'Gym/Fitness',
		intent: 'Neutral',
		contextKeywords: ['leg day', 'soreness', 'gym fail', 'giraffe', 'funny opener', 'workout']
	},
	{
		id: 'gym-004',
		text: 'I will be your permanent gym spotter, but warning: I will get distracted every single set.',
		tone: 'Smooth',
		category: 'Gym/Fitness',
		intent: 'Fun & Hookup',
		contextKeywords: ['gym spotter', 'weights', 'flirty', 'distracted', 'gym partner', 'chemistry']
	},
	{
		id: 'gym-005',
		text: 'What’s your pre-workout ritual? 400mg caffeine and existential dread, or normal person hydration?',
		tone: 'Friendly',
		category: 'Gym/Fitness',
		intent: 'Neutral',
		contextKeywords: ['preworkout', 'caffeine', 'fitness humor', 'energy', 'supplements', 'gym vibe']
	},
	{
		id: 'gym-006',
		text: 'Your form on those deadlifts was so clean it almost made me emotional.',
		tone: 'Friendly',
		category: 'Gym/Fitness',
		intent: 'Casual Date',
		contextKeywords: ['deadlift', 'form check', 'gym appreciation', 'lifting', 'respect', 'fitness']
	},
	{
		id: 'gym-007',
		text: 'Bro took the creatine Mewing Mogger super serum in the gym locker room no cap.',
		tone: 'Brainrot',
		category: 'Gym/Fitness',
		intent: 'Neutral',
		contextKeywords: ['mewing', 'mogger', 'creatine', 'brainrot', 'gym bro', 'sigma']
	},
	{
		id: 'gym-008',
		text: 'Post-gym smoothies on me this Saturday? You earned your carbs and I need an excuse to see you in person.',
		tone: 'Bold',
		category: 'Gym/Fitness',
		intent: 'Casual Date',
		contextKeywords: ['smoothie date', 'post workout', 'protein shake', 'saturday date', 'invitation']
	},
	{
		id: 'gym-009',
		text: 'I go to the gym 80% for health and 20% so I can aggressively carry all the grocery bags in one trip.',
		tone: 'Self-deprecating humor',
		category: 'Gym/Fitness',
		intent: 'Neutral',
		contextKeywords: ['groceries', 'gym reason', 'funny', 'relatable', 'fitness humor']
	},
	{
		id: 'gym-010',
		text: 'Running on the treadmill next to someone is an unspoken Olympic duel to the death. Tell me you also feel the tension.',
		tone: 'Playful tease',
		category: 'Gym/Fitness',
		intent: 'Neutral',
		contextKeywords: ['treadmill', 'running', 'gym rivalry', 'cardio', 'relatable banter']
	},
	{
		id: 'gym-011',
		text: 'I would say "don’t skip leg day" but clearly you wrote the textbook on it.',
		tone: 'Smooth',
		category: 'Gym/Fitness',
		intent: 'Fun & Hookup',
		contextKeywords: ['leg day', 'compliment', 'physique', 'gym fit', 'toned', 'legs']
	},
	{
		id: 'gym-012',
		text: 'Let’s be honest: does pilates actually work or is it just a socially accepted medieval stretching torture method?',
		tone: 'Playful tease',
		category: 'Gym/Fitness',
		intent: 'Casual Date',
		contextKeywords: ['pilates', 'yoga', 'reformer', 'stretching', 'humor', 'workout debate']
	},
	{
		id: 'gym-013',
		text: 'I will literally run a half-marathon just to be at the finish line handing you an electrolyte drink.',
		tone: 'Unhinged',
		category: 'Gym/Fitness',
		intent: 'A Relationship',
		contextKeywords: ['half marathon', 'running', 'unhinged devotion', 'electrolytes', 'simp energy']
	},
	{
		id: 'gym-014',
		text: 'Drop the gym playlist immediately. If it does not have heavy bass and questionable aggressive rap, I will be disappointed.',
		tone: 'Friendly',
		category: 'Gym/Fitness',
		intent: 'Neutral',
		contextKeywords: ['gym playlist', 'workout music', 'bass', 'rap', 'tunes', 'pump']

	},

	// ==========================================
	// 5. MUSIC & PLAYLISTS (14 items)
	// ==========================================
	{
		id: 'mus-001',
		text: 'I am trusting you with the aux cord in my car. If you play something atrocious, you walk. Deal?',
		tone: 'Playful tease',
		category: 'Music',
		intent: 'Casual Date',
		contextKeywords: ['aux cord', 'car ride', 'music taste', 'playlist', 'road trip', 'songs', 'banter']
	},
	{
		id: 'mus-002',
		text: 'Send me the one song that feels like driving home at 2 AM with the windows down.',
		tone: 'Smooth',
		category: 'Music',
		intent: 'A Relationship',
		contextKeywords: ['song recommendation', 'night drive', 'windows down', 'deep vibe', 'music connection']
	},
	{
		id: 'mus-003',
		text: 'Your Spotify Wrapped probably looks like an emotional rollercoaster with zero regrets.',
		tone: 'Friendly',
		category: 'Music',
		intent: 'Neutral',
		contextKeywords: ['spotify wrapped', 'music taste', 'genres', 'artists', 'streaming', 'listening']
	},
	{
		id: 'mus-004',
		text: 'If your music taste is as elite as your style, you might just be the most dangerous person on this app.',
		tone: 'Smooth',
		category: 'Music',
		intent: 'Casual Date',
		contextKeywords: ['music taste', 'elite vibe', 'style', 'dangerous charm', 'flirty compliment']
	},
	{
		id: 'mus-005',
		text: 'I need a song to listen to while making coffee that makes me feel like the main character. What’s your pick?',
		tone: 'Friendly',
		category: 'Music',
		intent: 'Neutral',
		contextKeywords: ['main character', 'coffee soundtrack', 'song rec', 'morning vibe', 'indie']
	},
	{
		id: 'mus-006',
		text: 'We are officially banned from concerts together because I will scream the bridge lyrics off-key with zero shame.',
		tone: 'Self-deprecating humor',
		category: 'Music',
		intent: 'Casual Date',
		contextKeywords: ['concerts', 'screaming lyrics', 'singing off key', 'live music', 'date banter']
	},
	{
		id: 'mus-007',
		text: 'That track is such a deep cut. Having immaculate underground music taste is an automatic +10,000 points in my book.',
		tone: 'Smooth',
		category: 'Music',
		intent: 'A Relationship',
		contextKeywords: ['underground music', 'deep cut', 'indie track', 'taste', 'rare songs', 'audiophile']
	},
	{
		id: 'mus-008',
		text: 'Bro got that Baby Gronk Rizz God soundtrack playing on repeat on the phonk speaker.',
		tone: 'Brainrot',
		category: 'Music',
		intent: 'Neutral',
		contextKeywords: ['phonk', 'baby gronk', 'rizz god', 'brainrot', 'tiktok sound', 'meme']
	},
	{
		id: 'mus-009',
		text: 'Concert date: we pick an indie artist neither of us has ever heard of, buy nosebleed tickets, and act like day-one superfans.',
		tone: 'Bold',
		category: 'Music',
		intent: 'Casual Date',
		contextKeywords: ['concert date', 'indie band', 'live show', 'adventure', 'spontaneous date']
	},
	{
		id: 'mus-010',
		text: 'My music taste bounces from 90s hip hop to midwestern emo to French jazz in 3 tracks. Don’t judge my algorithm.',
		tone: 'Self-deprecating humor',
		category: 'Music',
		intent: 'Neutral',
		contextKeywords: ['eclectic music', 'hip hop', 'jazz', 'emo', 'algorithm', 'spotify']
	},
	{
		id: 'mus-011',
		text: 'Let’s make a collaborative playlist where we trade songs back and forth until we figure each other out.',
		tone: 'Smooth',
		category: 'Music',
		intent: 'A Relationship',
		contextKeywords: ['collaborative playlist', 'spotify blend', 'trading songs', 'deep connection', 'music']
	},
	{
		id: 'mus-012',
		text: 'If listening to this artist was a crime, you would be serving a consecutive double life sentence with no parole.',
		tone: 'Playful tease',
		category: 'Music',
		intent: 'Fun & Hookup',
		contextKeywords: ['artist', 'guilty pleasure', 'music obsession', 'crime', 'teasing']
	},
	{
		id: 'mus-013',
		text: 'I will literally serenade you with acoustic guitar in the rain outside your window like a chaotic rom-com protagonist.',
		tone: 'Unhinged',
		category: 'Music',
		intent: 'Fun & Hookup',
		contextKeywords: ['serenade', 'rom com', 'rain', 'acoustic guitar', 'dramatic', 'unhinged love']
	},
	{
		id: 'mus-014',
		text: 'Vinyl or streaming? Choose wisely before I invite you over to listen to my record collection.',
		tone: 'Bold',
		category: 'Music',
		intent: 'Fun & Hookup',
		contextKeywords: ['vinyl records', 'turntable', 'record collection', 'home date', 'music lover']
	},

	// ==========================================
	// 6. WORK & TECH BANTER (14 items)
	// ==========================================
	{
		id: 'work-001',
		text: 'I hope this text finds you before your 4th pointless meeting that could have easily been a 2-sentence Slack message.',
		tone: 'Friendly',
		category: 'Work/Tech',
		intent: 'Casual Date',
		contextKeywords: ['slack', 'corporate', 'meetings', 'work day', 'relatable', 'office humor', 'tech']
	},
	{
		id: 'work-002',
		text: 'Are you a production bug on a Friday afternoon? Because you just completely disrupted my deployment schedule.',
		tone: 'Playful tease',
		category: 'Work/Tech',
		intent: 'Casual Date',
		contextKeywords: ['tech rizz', 'friday deploy', 'bug', 'developer', 'coding', 'nerd flirt']
	},
	{
		id: 'work-003',
		text: 'Let’s circle back, touch base, put a pin in it, and take this offline over a drink at 6 PM.',
		tone: 'Smooth',
		category: 'Work/Tech',
		intent: 'Casual Date',
		contextKeywords: ['corporate buzzwords', 'drinks date', 'after work', 'circle back', 'happy hour']
	},
	{
		id: 'work-004',
		text: 'My current work performance is powered 10% by caffeine and 90% by staring out the window wishing I was at happy hour with you.',
		tone: 'Bold',
		category: 'Work/Tech',
		intent: 'Casual Date',
		contextKeywords: ['caffeine', 'daydreaming', 'happy hour', 'bold flirt', 'office crush']
	},
	{
		id: 'work-005',
		text: 'I give you full permission to close your laptop lid with dramatic velocity and claim technical difficulties.',
		tone: 'Friendly',
		category: 'Work/Tech',
		intent: 'Neutral',
		contextKeywords: ['close laptop', 'end of day', 'work fatigue', 'funny advice', 'relatable']
	},
	{
		id: 'work-006',
		text: 'My LinkedIn headline says "Strategic Innovator" but in reality I am just really fast at copying Stack Overflow snippets.',
		tone: 'Self-deprecating humor',
		category: 'Work/Tech',
		intent: 'Neutral',
		contextKeywords: ['linkedin', 'stackoverflow', 'imposter syndrome', 'tech humor', 'developer']
	},
	{
		id: 'work-007',
		text: 'Are you an uncaught exception? Because my entire flow stopped working when I saw your profile.',
		tone: 'Playful tease',
		category: 'Work/Tech',
		intent: 'Fun & Hookup',
		contextKeywords: ['exception', 'software engineer', 'tech pickup line', 'coding', 'witty']
	},
	{
		id: 'work-008',
		text: 'Bro has that GPU compute H100 tensor core artificial intelligence rizz locked in.',
		tone: 'Brainrot',
		category: 'Work/Tech',
		intent: 'Neutral',
		contextKeywords: ['h100', 'nvidia', 'gpu', 'tensor core', 'ai rizz', 'tech brainrot']
	},
	{
		id: 'work-009',
		text: 'If you ever need an alibi to skip a mandatory "team-building pizza party", I am ready to stage an emergency extraction.',
		tone: 'Friendly',
		category: 'Work/Tech',
		intent: 'Casual Date',
		contextKeywords: ['pizza party', 'team building', 'corporate escape', 'funny banter', 'alibi']
	},
	{
		id: 'work-010',
		text: 'You look like the only person in the entire company who actually understands what the executive deck means.',
		tone: 'Smooth',
		category: 'Work/Tech',
		intent: 'A Relationship',
		contextKeywords: ['smart', 'executive', 'work crush', 'intellectual', 'competence', 'corporate']
	},
	{
		id: 'work-011',
		text: 'My calendar is completely booked, but I can submit an urgent RFC to prioritize a dinner slot for you.',
		tone: 'Playful tease',
		category: 'Work/Tech',
		intent: 'Casual Date',
		contextKeywords: ['calendar', 'rfc', 'dinner reservation', 'tech joke', 'schedule']
	},
	{
		id: 'work-012',
		text: 'I just accidentally replied-all with "sounds good" to 400 people. Please tell me you’ve made worse workplace mistakes.',
		tone: 'Self-deprecating humor',
		category: 'Work/Tech',
		intent: 'Neutral',
		contextKeywords: ['reply all', 'email blunder', 'embarrassing', 'work story', 'icebreaker']
	},
	{
		id: 'work-013',
		text: 'Let’s skip the 9-to-5 grind and start an artisanal candle business where our only job is smelling lavender and arguing about wick sizes.',
		tone: 'Unhinged',
		category: 'Work/Tech',
		intent: 'A Relationship',
		contextKeywords: ['quit job', 'candle business', 'daydream', 'chaotic escape', 'funny couple idea']
	},
	{
		id: 'work-014',
		text: 'You look too smart to be dealing with client spreadsheets right now. Let me rescue you for a cocktail.',
		tone: 'Bold',
		category: 'Work/Tech',
		intent: 'Casual Date',
		contextKeywords: ['spreadsheets', 'cocktails', 'rescue', 'after work date', 'direct opener']
	},

	// ==========================================
	// 7. BAD TEXTERS & SLOW REPLIES (14 items)
	// ==========================================
	{
		id: 'badtxt-001',
		text: 'I was about to file a missing persons report with Interpol, but I am glad to see you have survived.',
		tone: 'Playful tease',
		category: 'Bad Texters',
		intent: 'Casual Date',
		contextKeywords: ['missing persons', 'interpol', 'slow reply', 'ghosting', 'tease bad texter', 'witty callback']
	},
	{
		id: 'badtxt-002',
		text: 'Did my message get delivered via carrier pigeon across stormy seas, or was there a postal strike?',
		tone: 'Playful tease',
		category: 'Bad Texters',
		intent: 'Neutral',
		contextKeywords: ['carrier pigeon', 'slow texter', 'banter', 'humor', 'delay', 'reply time']
	},
	{
		id: 'badtxt-003',
		text: 'I respect the commitment to taking 3-5 business days to reply. Very professional of you.',
		tone: 'Playful tease',
		category: 'Bad Texters',
		intent: 'Casual Date',
		contextKeywords: ['business days', 'dry texter', 'slow reply', 'sarcasm', 'corporate texting']
	},
	{
		id: 'badtxt-004',
		text: 'Your typing bubbles appeared and disappeared 3 times. Did you write an entire screenplay and scrap it?',
		tone: 'Playful tease',
		category: 'Bad Texters',
		intent: 'Casual Date',
		contextKeywords: ['typing bubbles', 'overthinking', 'deleted message', 'screenplay', 'flirty callout']
	},
	{
		id: 'badtxt-005',
		text: 'I’m diagnosing you with chronic "thought I replied in my head" syndrome. Treatment is a 20-minute phone call.',
		tone: 'Smooth',
		category: 'Bad Texters',
		intent: 'Casual Date',
		contextKeywords: ['phone call', 'replied in head', 'diagnosis', 'smooth pivot', 'voice date']
	},
	{
		id: 'badtxt-006',
		text: 'Clearly texting isn’t doing your sparkling personality justice. Let’s talk over drinks instead so you can’t lag.',
		tone: 'Bold',
		category: 'Bad Texters',
		intent: 'Casual Date',
		contextKeywords: ['drinks', 'lagging', 'pivot to real life', 'bold move', 'in person date']
	},
	{
		id: 'badtxt-007',
		text: 'Bro is running on 56k dial-up connection in a subterranean bunker fr fr.',
		tone: 'Brainrot',
		category: 'Bad Texters',
		intent: 'Neutral',
		contextKeywords: ['dial up', 'bunker', 'brainrot', 'ping', 'slow reply', 'wifi']
	},
	{
		id: 'badtxt-008',
		text: 'In the time it took you to text back, I learned conversational Mandarin, ran a triathlon, and adopted a golden retriever.',
		tone: 'Unhinged',
		category: 'Bad Texters',
		intent: 'Casual Date',
		contextKeywords: ['triathlon', 'exaggeration', 'golden retriever', 'funny drama', 'slow text']
	},
	{
		id: 'badtxt-009',
		text: 'No worries at all! I know how chaotic life gets. Hope whatever had you busy went smoothly.',
		tone: 'Friendly',
		category: 'Bad Texters',
		intent: 'A Relationship',
		contextKeywords: ['grace', 'understanding', 'chill', 'no pressure', 'kindness', 'friendly']
	},
	{
		id: 'badtxt-010',
		text: 'If you take this long to pick appetizers at a restaurant, we might be there until 2028.',
		tone: 'Playful tease',
		category: 'Bad Texters',
		intent: 'Casual Date',
		contextKeywords: ['restaurant', 'indecisive', 'appetizers', 'playful tease', 'dinner date']
	},
	{
		id: 'badtxt-011',
		text: 'I almost sent a smoke signal to your zip code, but fire safety regulations held me back.',
		tone: 'Playful tease',
		category: 'Bad Texters',
		intent: 'Neutral',
		contextKeywords: ['smoke signal', 'fire safety', 'funny joke', 'calling out ghosting']
	},
	{
		id: 'badtxt-012',
		text: 'I forgive your terrible response time exclusively because your profile photos are dangerously attractive.',
		tone: 'Bold',
		category: 'Bad Texters',
		intent: 'Fun & Hookup',
		contextKeywords: ['attractive', 'forgiven', 'bold flirt', 'hot excuse', 'bad texter']
	},
	{
		id: 'badtxt-013',
		text: 'Don’t panic, take your time. Good things come to those who wait, but great things usually have a drink with me on Friday.',
		tone: 'Smooth',
		category: 'Bad Texters',
		intent: 'Casual Date',
		contextKeywords: ['smooth transition', 'friday night', 'patient', 'charming', 'drink date']
	},
	{
		id: 'badtxt-014',
		text: 'Welcome back to the land of the living! What did I miss in your offline adventures?',
		tone: 'Friendly',
		category: 'Bad Texters',
		intent: 'Neutral',
		contextKeywords: ['welcome back', 'warm opener', 'friendly', 'offline', 're-engage']
	},

	// ==========================================
	// 8. SELF-DEPRECATING HUMOR (14 items)
	// ==========================================
	{
		id: 'self-001',
		text: 'My greatest life achievements include tripping on completely flat surfaces and remembering lyrics from 2008 pop songs.',
		tone: 'Self-deprecating humor',
		category: 'Self-deprecating humor',
		intent: 'Casual Date',
		contextKeywords: ['clumsy', 'pop songs', 'self deprecating', 'funny intro', 'humble', 'relatable']
	},
	{
		id: 'self-002',
		text: 'I have the confidence of a toddler wearing a superhero cape and the motor skills to match.',
		tone: 'Self-deprecating humor',
		category: 'Self-deprecating humor',
		intent: 'Casual Date',
		contextKeywords: ['toddler cape', 'funny', 'cute self burn', 'charming', 'humility']
	},
	{
		id: 'self-003',
		text: 'I’m not saying I’m high maintenance, but if my iced coffee doesn’t have the exact right ice-to-milk ratio, my day is ruined.',
		tone: 'Self-deprecating humor',
		category: 'Self-deprecating humor',
		intent: 'Neutral',
		contextKeywords: ['iced coffee', 'high maintenance', 'dramatic', 'relatable flaw', 'coffee addiction']
	},
	{
		id: 'self-004',
		text: 'I bring a lot to the table: great Spotify recommendations, mild existential anxiety, and the ability to find dogs at any party.',
		tone: 'Self-deprecating humor',
		category: 'Self-deprecating humor',
		intent: 'A Relationship',
		contextKeywords: ['dogs at party', 'spotify', 'anxiety', 'what i bring', 'charming flaw', 'humor']
	},
	{
		id: 'self-005',
		text: 'My cooking skills peak at assembling a charcuterie board that is 90% cheese and 10% regret.',
		tone: 'Self-deprecating humor',
		category: 'Self-deprecating humor',
		intent: 'Casual Date',
		contextKeywords: ['charcuterie', 'cheese', 'cooking fail', 'funny food', 'casual banter']
	},
	{
		id: 'self-006',
		text: 'I look calm on the outside, but internally I am practicing how I will introduce you to my golden retriever.',
		tone: 'Smooth',
		category: 'Self-deprecating humor',
		intent: 'A Relationship',
		contextKeywords: ['dog', 'overthinking', 'sweet confession', 'wholesome', 'relationship']
	},
	{
		id: 'self-007',
		text: 'I have a master’s degree in overthinking texts and a bachelor’s in re-reading sent messages 14 times.',
		tone: 'Self-deprecating humor',
		category: 'Self-deprecating humor',
		intent: 'Casual Date',
		contextKeywords: ['overthinking', 'degrees', 'texting anxiety', 'relatable', 'witty']
	},
	{
		id: 'self-008',
		text: 'L rizz on my end tbh, I tried to look cool and stubbed my toe on the vibe check.',
		tone: 'Brainrot',
		category: 'Self-deprecating humor',
		intent: 'Neutral',
		contextKeywords: ['l rizz', 'vibe check', 'brainrot', 'clumsy', 'gen z']
	},
	{
		id: 'self-009',
		text: 'My doctor told me to avoid unnecessary excitement, but then your profile popped up so now my cardiologist is concerned.',
		tone: 'Smooth',
		category: 'Self-deprecating humor',
		intent: 'Fun & Hookup',
		contextKeywords: ['cardiologist', 'doctor', 'excitement', 'heart rate', 'flirty exaggeration']
	},
	{
		id: 'self-010',
		text: 'I will literally research 45 minutes on Google Maps to find the best parking spot before leaving the house.',
		tone: 'Self-deprecating humor',
		category: 'Self-deprecating humor',
		intent: 'Neutral',
		contextKeywords: ['parking', 'google maps', 'anxiety', 'driver', 'quirks']
	},
	{
		id: 'self-011',
		text: 'I am 85% awkward pauses and 15% surprising moments of witty banter. You caught me during the 15%.',
		tone: 'Self-deprecating humor',
		category: 'Self-deprecating humor',
		intent: 'Casual Date',
		contextKeywords: ['awkward', 'witty moments', 'banter', 'honest', 'endearing']
	},
	{
		id: 'self-012',
		text: 'I’m definitely the person who pulls a door when it says PUSH in giant neon letters.',
		tone: 'Self-deprecating humor',
		category: 'Self-deprecating humor',
		intent: 'Neutral',
		contextKeywords: ['push pull door', 'silly', 'clumsy', 'relatable', 'icebreaker']
	},
	{
		id: 'self-013',
		text: 'I’d offer to fight a bear to prove my affection, but realistically a moderately angry goose could defeat me.',
		tone: 'Unhinged',
		category: 'Self-deprecating humor',
		intent: 'A Relationship',
		contextKeywords: ['fight a bear', 'angry goose', 'hilarious exaggeration', 'affection', 'unhinged']
	},
	{
		id: 'self-014',
		text: 'If being hopelessly charmed by someone was a tax deduction, I’d be getting a massive refund right now.',
		tone: 'Smooth',
		category: 'Self-deprecating humor',
		intent: 'A Relationship',
		contextKeywords: ['tax deduction', 'refund', 'charmed', 'clever', 'romantic']
	},

	// ==========================================
	// 9. PHOTO REACTIONS & COMPLIMENTS (15 items)
	// ==========================================
	{
		id: 'photo-001',
		text: 'That outfit is doing dangerous levels of damage to my concentration.',
		tone: 'Bold',
		category: 'Photo reactions',
		intent: 'Fun & Hookup',
		contextKeywords: ['outfit', 'fit check', 'photo reaction', 'bold compliment', 'distraction', 'fashion']
	},
	{
		id: 'photo-002',
		text: 'The golden hour lighting is nice, but let’s be real: you are doing 99% of the heavy lifting in this picture.',
		tone: 'Smooth',
		category: 'Photo reactions',
		intent: 'Casual Date',
		contextKeywords: ['golden hour', 'lighting', 'selfie', 'compliment', 'sunset glow', 'aesthetic']
	},
	{
		id: 'photo-003',
		text: 'Your smile in the 3rd picture genuinely made my day 10 times better.',
		tone: 'Friendly',
		category: 'Photo reactions',
		intent: 'A Relationship',
		contextKeywords: ['smile', '3rd picture', 'wholesome', 'warm compliment', 'sweet', 'profile photo']
	},
	{
		id: 'photo-004',
		text: 'Who authorized you to drop a photo this illegal without a warning label?',
		tone: 'Playful tease',
		category: 'Photo reactions',
		intent: 'Fun & Hookup',
		contextKeywords: ['illegal photo', 'warning label', 'hot', 'tease', 'dramatic compliment']
	},
	{
		id: 'photo-005',
		text: 'I need to know the backstory behind the chaotic expression in photo number 4.',
		tone: 'Friendly',
		category: 'Photo reactions',
		intent: 'Neutral',
		contextKeywords: ['photo 4', 'expression', 'backstory', 'curious', 'starter', 'candid']
	},
	{
		id: 'photo-006',
		text: 'That dog in your photo is outrageously cute, but they definitely know they are the second prettiest in the picture.',
		tone: 'Smooth',
		category: 'Photo reactions',
		intent: 'Casual Date',
		contextKeywords: ['dog photo', 'pet picture', 'puppy', 'smooth line', 'compliment']
	},
	{
		id: 'photo-007',
		text: 'Level 10 Gyatt aura mogging the entire feed right now fr no cap.',
		tone: 'Brainrot',
		category: 'Photo reactions',
		intent: 'Neutral',
		contextKeywords: ['gyatt', 'mogging', 'aura', 'brainrot', 'photo comment', 'tiktok']
	},
	{
		id: 'photo-008',
		text: 'I was going to say something cool and witty, but you completely short-circuited my brain with that fit.',
		tone: 'Smooth',
		category: 'Photo reactions',
		intent: 'Fun & Hookup',
		contextKeywords: ['short circuit', 'speechless', 'stunned', 'fit check', 'bold attraction']
	},
	{
		id: 'photo-009',
		text: 'You have that classic 90s cinema lead energy where even a blurry candid looks like a movie still.',
		tone: 'Smooth',
		category: 'Photo reactions',
		intent: 'A Relationship',
		contextKeywords: ['90s movie', 'cinema', 'candid', 'aesthetic', 'movie star', 'nostalgic']
	},
	{
		id: 'photo-010',
		text: 'Are you trying to start a riot in my notifications? Because this picture is criminal.',
		tone: 'Bold',
		category: 'Photo reactions',
		intent: 'Fun & Hookup',
		contextKeywords: ['criminal', 'notifications', 'fire selfie', 'direct flirt', 'spicy']
	},
	{
		id: 'photo-011',
		text: 'The jacket is iconic. Where did you find it, or is that confidential fashion trade secret?',
		tone: 'Friendly',
		category: 'Photo reactions',
		intent: 'Neutral',
		contextKeywords: ['jacket', 'vintage', 'fashion', 'style', 'compliment', 'clothing']
	},
	{
		id: 'photo-012',
		text: 'I just showed my friends this photo and they all agreed I am punching way above my weight class.',
		tone: 'Playful tease',
		category: 'Photo reactions',
		intent: 'Casual Date',
		contextKeywords: ['out of my league', 'weight class', 'friends agreed', 'humble rizz', 'funny']
	},
	{
		id: 'photo-013',
		text: 'I will literally print this picture, frame it in mahogany wood, and mount it in the Louvre tonight.',
		tone: 'Unhinged',
		category: 'Photo reactions',
		intent: 'Fun & Hookup',
		contextKeywords: ['louvre', 'mahogany', 'framed', 'unhinged compliment', 'dramatic simp']
	},
	{
		id: 'photo-014',
		text: 'You have the kind of eyes that look right through all the small talk directly to my soul.',
		tone: 'Smooth',
		category: 'Photo reactions',
		intent: 'A Relationship',
		contextKeywords: ['eyes', 'deep gaze', 'romantic', 'intense chemistry', 'connection']
	},
	{
		id: 'photo-015',
		text: 'Mirror selfies are usually a 5/10, but you managed to make this look like high-fashion editorial.',
		tone: 'Playful tease',
		category: 'Photo reactions',
		intent: 'Casual Date',
		contextKeywords: ['mirror selfie', 'editorial', 'vogue', 'tease compliment', 'stylish']
	},

	// ==========================================
	// 10. QUESTIONS & PROVOCATIVE DILEMMAS (15 items)
	// ==========================================
	{
		id: 'ques-001',
		text: 'Critical life question: You get $10M, but every song you hear for the rest of your life is played by an aggressive mariachi band. Do you take it?',
		tone: 'Playful tease',
		category: 'Questions',
		intent: 'Casual Date',
		contextKeywords: ['hypothetical', 'dilemma', 'mariachi', '10 million', 'funny question', 'icebreaker']
	},
	{
		id: 'ques-002',
		text: 'What is a popular opinion or trend that everyone else loves but you secretly think is completely overrated?',
		tone: 'Friendly',
		category: 'Questions',
		intent: 'Neutral',
		contextKeywords: ['unpopular opinion', 'overrated', 'hot take', 'trend', 'deep conversation']
	},
	{
		id: 'ques-003',
		text: 'If we were stuck in a zombie apocalypse together, what is your survival utility and how fast are you betraying me for snacks?',
		tone: 'Playful tease',
		category: 'Questions',
		intent: 'Casual Date',
		contextKeywords: ['zombie apocalypse', 'survival', 'betrayal', 'snacks', 'scenario', 'banter']
	},
	{
		id: 'ques-004',
		text: 'What is the most chaotic piece of trivia you know that lives rent-free in your mind at all hours?',
		tone: 'Friendly',
		category: 'Questions',
		intent: 'Neutral',
		contextKeywords: ['trivia', 'weird facts', 'rent free', 'chaotic facts', 'curiosity']
	},
	{
		id: 'ques-005',
		text: 'Truth or Dare: but the only truth is your real opinion of me, and the only dare is letting me take you out this weekend.',
		tone: 'Bold',
		category: 'Questions',
		intent: 'Casual Date',
		contextKeywords: ['truth or dare', 'date invitation', 'bold question', 'weekend plans', 'flirt']
	},
	{
		id: 'ques-006',
		text: 'Would you rather have the ability to teleport anywhere instantly or have infinite flawless restaurant recommendations worldwide?',
		tone: 'Friendly',
		category: 'Questions',
		intent: 'Casual Date',
		contextKeywords: ['would you rather', 'teleport', 'foodie', 'superpower', 'fun debate']
	},
	{
		id: 'ques-007',
		text: 'Skibidi toilet or Livvy Dunne rizzing up Baby Gronk: which ancient historical event reshaped humanity more?',
		tone: 'Brainrot',
		category: 'Questions',
		intent: 'Neutral',
		contextKeywords: ['skibidi toilet', 'livvy dunne', 'baby gronk', 'brainrot debate', 'meme history']
	},
	{
		id: 'ques-008',
		text: 'What is something you are unapologetically passionate about that most people find completely boring?',
		tone: 'Smooth',
		category: 'Questions',
		intent: 'A Relationship',
		contextKeywords: ['passionate', 'niche interest', 'deep dive', 'listening', 'meaningful connection']
	},
	{
		id: 'ques-009',
		text: 'If you had to describe your current vibe in 3 emojis and a movie genre, what are we working with?',
		tone: 'Friendly',
		category: 'Questions',
		intent: 'Neutral',
		contextKeywords: ['emojis', 'movie genre', 'vibe check', 'quick icebreaker', 'fun']
	},
	{
		id: 'ques-010',
		text: 'What’s a hill you are 100% prepared to die on, no matter how ridiculous it sounds to the rest of society?',
		tone: 'Playful tease',
		category: 'Questions',
		intent: 'Casual Date',
		contextKeywords: ['hill to die on', 'stubborn', 'opinions', 'funny debate', 'banter starter']
	},
	{
		id: 'ques-011',
		text: 'If you could erase one social convention forever (like small talk about the weather), what’s getting deleted first?',
		tone: 'Friendly',
		category: 'Questions',
		intent: 'Neutral',
		contextKeywords: ['social conventions', 'small talk', 'weather', 'philosophy', 'deep question']
	},
	{
		id: 'ques-012',
		text: 'Be completely honest: if you had a clone of yourself, would you two be best friends or mortal arch-enemies?',
		tone: 'Playful tease',
		category: 'Questions',
		intent: 'Casual Date',
		contextKeywords: ['clone', 'self awareness', 'arch enemies', 'witty question', 'personality']
	},
	{
		id: 'ques-013',
		text: 'What’s the best spontaneous decision you ever made that completely altered your life trajectory?',
		tone: 'Smooth',
		category: 'Questions',
		intent: 'A Relationship',
		contextKeywords: ['spontaneous decision', 'life trajectory', 'meaningful story', 'destiny', 'deep talk']
	},
	{
		id: 'ques-014',
		text: 'If our first date was scored by a dramatic film composer, who would you hire to compose the soundtrack?',
		tone: 'Smooth',
		category: 'Questions',
		intent: 'Casual Date',
		contextKeywords: ['hans zimmer', 'soundtrack', 'film score', 'first date idea', 'cinematic']
	},
	{
		id: 'ques-015',
		text: 'Are you more of an "everything happens for a reason" romantic or a "we are floating on a rock in space let’s have fun" realist?',
		tone: 'Smooth',
		category: 'Questions',
		intent: 'A Relationship',
		contextKeywords: ['destiny', 'fate', 'existential', 'philosophy of dating', 'deep chemistry']
	},

	// ==========================================
	// 11. LATE NIGHT TEXTS (15 items)
	// ==========================================
	{
		id: 'late-001',
		text: 'It’s 1 AM. Are you sleeping like a well-adjusted human, or are you down an incomprehensible YouTube rabbit hole like the rest of us?',
		tone: 'Friendly',
		category: 'Late night texts',
		intent: 'Casual Date',
		contextKeywords: ['1 am', 'insomnia', 'youtube rabbit hole', 'late night', 'sleep schedule', 'night owl']
	},
	{
		id: 'late-002',
		text: 'I promised myself I’d go to bed early, but then I started wondering what you were doing right now.',
		tone: 'Smooth',
		category: 'Late night texts',
		intent: 'Fun & Hookup',
		contextKeywords: ['bed early', 'thinking of you', 'late night flirt', 'smooth confession', 'cozy']
	},
	{
		id: 'late-003',
		text: 'Late night hot take: the best conversations always happen when both people are slightly sleep deprived and dangerously honest.',
		tone: 'Smooth',
		category: 'Late night texts',
		intent: 'A Relationship',
		contextKeywords: ['sleep deprived', 'late night honesty', 'deep conversations', 'vulnerability', '2 am']
	},
	{
		id: 'late-004',
		text: 'If you’re awake, send me your most unhinged late-night thought with zero context.',
		tone: 'Playful tease',
		category: 'Late night texts',
		intent: 'Casual Date',
		contextKeywords: ['unhinged thought', 'no context', 'late night game', 'insomnia', 'witty']
	},
	{
		id: 'late-005',
		text: 'Midnight snack emergency: cold pizza, leftover pad thai, or sweet cereal eaten directly out of the box?',
		tone: 'Friendly',
		category: 'Late night texts',
		intent: 'Neutral',
		contextKeywords: ['midnight snack', 'cereal', 'cold pizza', 'late night food', 'cozy']
	},
	{
		id: 'late-006',
		text: 'My ceiling is tired of me staring at it. Entertain me with a story before I start sleep-shopping on Amazon.',
		tone: 'Playful tease',
		category: 'Late night texts',
		intent: 'Casual Date',
		contextKeywords: ['insomnia', 'entertain me', 'amazon shopping', 'ceiling', 'late night banter']
	},
	{
		id: 'late-007',
		text: 'Bro is awake at 3 AM doing the phantom tax sigma mewing session.',
		tone: 'Brainrot',
		category: 'Late night texts',
		intent: 'Neutral',
		contextKeywords: ['3 am', 'phantom tax', 'sigma', 'mewing', 'brainrot', 'night']
	},
	{
		id: 'late-008',
		text: 'I should be asleep, but you look way too good to ignore until morning.',
		tone: 'Bold',
		category: 'Late night texts',
		intent: 'Fun & Hookup',
		contextKeywords: ['asleep', 'bold flirt', 'late night hookup', 'spicy text', 'direct attraction']
	},
	{
		id: 'late-009',
		text: 'Tell me something you would never admit in the daylight.',
		tone: 'Smooth',
		category: 'Late night texts',
		intent: 'A Relationship',
		contextKeywords: ['secret', 'confession', 'vulnerability', 'intimacy', 'late night talk']
	},
	{
		id: 'late-010',
		text: 'I’m currently debating whether to drink warm milk like an 80-year-old grandfather or stay up till 4 AM contemplating life.',
		tone: 'Self-deprecating humor',
		category: 'Late night texts',
		intent: 'Neutral',
		contextKeywords: ['warm milk', 'grandfather', 'contemplating life', 'funny late night', 'sleep']
	},
	{
		id: 'late-011',
		text: 'Is it too late to ask you what your favorite childhood cartoon was, or are we saving that for date two?',
		tone: 'Friendly',
		category: 'Late night texts',
		intent: 'Casual Date',
		contextKeywords: ['childhood cartoon', 'nostalgia', 'date two', 'sweet question', 'late text']
	},
	{
		id: 'late-012',
		text: 'If I sneak over with two pints of ice cream and a terrible horror movie right now, are you unlocking the door?',
		tone: 'Bold',
		category: 'Late night texts',
		intent: 'Fun & Hookup',
		contextKeywords: ['ice cream', 'horror movie', 'sneak over', 'late night visit', 'spontaneous']
	},
	{
		id: 'late-013',
		text: 'My sleep paralysis demon just told me to text you, so really this message is out of my hands.',
		tone: 'Unhinged',
		category: 'Late night texts',
		intent: 'Fun & Hookup',
		contextKeywords: ['sleep paralysis demon', 'unhinged rizz', 'chaotic late text', 'dark humor']
	},
	{
		id: 'late-014',
		text: 'Nothing good happens after 2 AM, except potentially this conversation.',
		tone: 'Smooth',
		category: 'Late night texts',
		intent: 'Casual Date',
		contextKeywords: ['after 2 am', 'ted mosby', 'smooth line', 'late night charm', 'chemistry']
	},
	{
		id: 'late-015',
		text: 'Let’s make a pact: if either of us falls asleep mid-sentence, the other person wins bragging rights until tomorrow.',
		tone: 'Playful tease',
		category: 'Late night texts',
		intent: 'Casual Date',
		contextKeywords: ['falling asleep', 'pact', 'bragging rights', 'cute bedtime game', 'texting']
	},

	// ==========================================
	// 12. IG STORY REPLIES & SOCIAL HOOKS (15 items)
	// ==========================================
	{
		id: 'story-001',
		text: 'Excuse me, posting this on a regular Tuesday afternoon with zero courtesy warning is reckless behavior.',
		tone: 'Playful tease',
		category: 'IG story replies',
		intent: 'Fun & Hookup',
		contextKeywords: ['story reply', 'tuesday', 'reckless behavior', 'attractive story', 'flirty reaction', 'instagram']
	},
	{
		id: 'story-002',
		text: 'Location tag please? I need to add this to my "places I need to take someone cute" list.',
		tone: 'Smooth',
		category: 'IG story replies',
		intent: 'Casual Date',
		contextKeywords: ['location tag', 'places to go', 'someone cute', 'smooth slide in', 'story dms']
	},
	{
		id: 'story-003',
		text: 'I voted on your story poll just to prove I am your most supportive follower.',
		tone: 'Playful tease',
		category: 'IG story replies',
		intent: 'Casual Date',
		contextKeywords: ['story poll', 'supportive', 'instagram vote', 'playful dm', 'engagement']
	},
	{
		id: 'story-004',
		text: 'Drop the recipe or venue name immediately—do not gatekeep greatness.',
		tone: 'Friendly',
		category: 'IG story replies',
		intent: 'Neutral',
		contextKeywords: ['gatekeep', 'recipe', 'venue', 'food story', 'friendly reply', 'dms']
	},
	{
		id: 'story-005',
		text: 'That aesthetic is immaculate. Who was your photographer or do you just carry a personal camera crew?',
		tone: 'Smooth',
		category: 'IG story replies',
		intent: 'Casual Date',
		contextKeywords: ['aesthetic', 'photographer', 'camera crew', 'photo story', 'compliment']
	},
	{
		id: 'story-006',
		text: 'I was casually swiping stories and had to do a double-take. You look stunning.',
		tone: 'Bold',
		category: 'IG story replies',
		intent: 'Fun & Hookup',
		contextKeywords: ['double take', 'stunning', 'direct compliment', 'bold dm', 'swiping stories']
	},
	{
		id: 'story-007',
		text: 'Story got that Livvy Dunne Duke Dennis maximum drip level gyatt.',
		tone: 'Brainrot',
		category: 'IG story replies',
		intent: 'Neutral',
		contextKeywords: ['duke dennis', 'livvy dunne', 'drip', 'brainrot story reply', 'gen z meme']
	},
	{
		id: 'story-008',
		text: 'I will literally Venmo you $5 if you tell me how that drink actually tasted.',
		tone: 'Friendly',
		category: 'IG story replies',
		intent: 'Neutral',
		contextKeywords: ['venmo', 'cocktail', 'drink review', 'humorous dm', 'story reply']
	},
	{
		id: 'story-009',
		text: 'Are you having that much fun without me or did you stage this purely for the story aesthetic?',
		tone: 'Playful tease',
		category: 'IG story replies',
		intent: 'Casual Date',
		contextKeywords: ['having fun', 'staged aesthetic', 'teasing dm', 'playful hook', 'social banter']
	},
	{
		id: 'story-010',
		text: 'That sunset is nice, but I’ve seen better... specifically in the story right after this one.',
		tone: 'Playful tease',
		category: 'IG story replies',
		intent: 'Casual Date',
		contextKeywords: ['sunset', 'tease', 'story sequence', 'witty hook', 'instagram dm']
	},
	{
		id: 'story-011',
		text: 'I am formally requesting an invitation next time you go somewhere that cool.',
		tone: 'Bold',
		category: 'IG story replies',
		intent: 'Casual Date',
		contextKeywords: ['invitation', 'formal request', 'cool place', 'direct invite', 'story response']
	},
	{
		id: 'story-012',
		text: 'My phone screen just overheated from this story post, send ice pack.',
		tone: 'Playful tease',
		category: 'IG story replies',
		intent: 'Fun & Hookup',
		contextKeywords: ['overheated', 'ice pack', 'fire emoji', 'hot story', 'funny flirt']
	},
	{
		id: 'story-013',
		text: 'I am sliding into your DMs with all the grace of a penguin on an ice skating rink.',
		tone: 'Self-deprecating humor',
		category: 'IG story replies',
		intent: 'Casual Date',
		contextKeywords: ['sliding in dms', 'penguin', 'ice rink', 'cute opener', 'self deprecating']
	},
	{
		id: 'story-014',
		text: 'I will sell my soul to whichever deity produced that dessert on your story.',
		tone: 'Unhinged',
		category: 'IG story replies',
		intent: 'Fun & Hookup',
		contextKeywords: ['dessert', 'sell my soul', 'food craving', 'unhinged dm', 'story food']
	},
	{
		id: 'story-015',
		text: 'I saw your story and realized I haven’t said hello in way too long. How’s your week treating you?',
		tone: 'Friendly',
		category: 'IG story replies',
		intent: 'A Relationship',
		contextKeywords: ['say hello', 'catching up', 'thoughtful dm', 'warm reconnection', 'friendly']
	},

	// ==========================================
	// 13. ADDITIONAL CURATED HIGH-CONVERTING RIZZ & BANTER (40+ items)
	// ==========================================
	{
		id: 'extra-001',
		text: 'Do you believe in love at first swipe, or should I unmatch and match you again to make a stronger impression?',
		tone: 'Playful tease',
		category: 'Questions',
		intent: 'Casual Date',
		contextKeywords: ['love at first sight', 'first swipe', 'dating apps', 'first impression', 'witty opener']
	},
	{
		id: 'extra-002',
		text: 'I usually wait 20 minutes to respond so I seem mysterious, but you completely ruined my pacing.',
		tone: 'Smooth',
		category: 'Bad Texters',
		intent: 'Casual Date',
		contextKeywords: ['mysterious', 'response time', 'pacing', 'smooth compliment', 'flirty']
	},
	{
		id: 'extra-003',
		text: 'My friends told me not to open with something cheesy, so let’s pretend I said something incredibly profound and mysterious.',
		tone: 'Self-deprecating humor',
		category: 'Questions',
		intent: 'Casual Date',
		contextKeywords: ['cheesy line', 'mysterious', 'friends advice', 'humorous opener', 'charming']
	},
	{
		id: 'extra-004',
		text: 'You have that dangerous combination of being ridiculously pretty and looking like you could easily outsmart me in chess.',
		tone: 'Smooth',
		category: 'Hobbies',
		intent: 'Casual Date',
		contextKeywords: ['pretty and smart', 'chess', 'flattery', 'wit', 'intellectual rizz']
	},
	{
		id: 'extra-005',
		text: 'If you could instantly become a world-class master at any instrument, which one are you picking and what song are you playing first?',
		tone: 'Friendly',
		category: 'Music',
		intent: 'Neutral',
		contextKeywords: ['instrument', 'master', 'music question', 'icebreaker', 'deep conversation']
	},
	{
		id: 'extra-006',
		text: 'I’m taking you out for tacos. The only rule is: no talking about LinkedIn, work deliverables, or crypto.',
		tone: 'Bold',
		category: 'Work/Tech',
		intent: 'Casual Date',
		contextKeywords: ['tacos date', 'rules', 'no linkedin', 'no work talk', 'dinner invite', 'bold']
	},
	{
		id: 'extra-007',
		text: 'You give off heavy "knows where the best secret speakeasy in the city is" energy.',
		tone: 'Smooth',
		category: 'IG story replies',
		intent: 'Casual Date',
		contextKeywords: ['speakeasy', 'hidden bar', 'cocktails', 'mystique', 'cool vibe']
	},
	{
		id: 'extra-008',
		text: 'Bro has the whole Ohio multiverse trembling with that sigma rizz.',
		tone: 'Brainrot',
		category: 'Self-deprecating humor',
		intent: 'Neutral',
		contextKeywords: ['ohio', 'multiverse', 'sigma', 'rizz', 'brainrot', 'tiktok']
	},
	{
		id: 'extra-009',
		text: 'I would say "let’s grab coffee", but you look like you already have enough energy to power a small European nation.',
		tone: 'Playful tease',
		category: 'Cooking',
		intent: 'Casual Date',
		contextKeywords: ['coffee date', 'energy', 'european nation', 'teasing invite', 'match vibe']
	},
	{
		id: 'extra-010',
		text: 'Quick vibe check: You’re stranded on a deserted island and you get one album, one book, and one hot sauce. What are they?',
		tone: 'Friendly',
		category: 'Questions',
		intent: 'Neutral',
		contextKeywords: ['desert island', 'hot sauce', 'album', 'book', 'vibe check', 'favorites']
	},
	{
		id: 'extra-011',
		text: 'I was trying to come up with a pickup line, but honestly I’d rather just ask what made you smile today.',
		tone: 'Friendly',
		category: 'Questions',
		intent: 'A Relationship',
		contextKeywords: ['pickup line', 'what made you smile', 'wholesome', 'genuine', 'kindness']
	},
	{
		id: 'extra-012',
		text: 'Are you always this effortlessly cool or did you practice in the mirror for 45 minutes before taking that picture?',
		tone: 'Playful tease',
		category: 'Photo reactions',
		intent: 'Fun & Hookup',
		contextKeywords: ['effortlessly cool', 'mirror practice', 'teasing compliment', 'stylish']
	},
	{
		id: 'extra-013',
		text: 'I’ll buy the first round if you tell me your most irrational irrational fear. Mine is revolving doors.',
		tone: 'Friendly',
		category: 'Questions',
		intent: 'Casual Date',
		contextKeywords: ['first round', 'irrational fear', 'revolving doors', 'drinks bet', 'vulnerability']
	},
	{
		id: 'extra-014',
		text: 'I’m prepared to write a 5-paragraph essay on why your aesthetic is superior to 99% of the internet.',
		tone: 'Smooth',
		category: 'Photo reactions',
		intent: 'Fun & Hookup',
		contextKeywords: ['5 paragraph essay', 'aesthetic', 'superior', 'flirty praise', 'instagram']
	},
	{
		id: 'extra-015',
		text: 'My golden retriever just saw your picture and immediately approved our wedding registry.',
		tone: 'Unhinged',
		category: 'Photo reactions',
		intent: 'A Relationship',
		contextKeywords: ['golden retriever', 'wedding registry', 'unhinged romance', 'dog approved', 'humor']
	},
	{
		id: 'extra-016',
		text: 'Is your passport currently crying in a drawer or are you already scheming your next escape?',
		tone: 'Friendly',
		category: 'Travel',
		intent: 'Casual Date',
		contextKeywords: ['passport', 'next escape', 'wanderlust', 'travel plans', 'scheming']
	},
	{
		id: 'extra-017',
		text: 'If being stunning was an hourly wage, you’d be buying out Elon Musk by Friday.',
		tone: 'Bold',
		category: 'Photo reactions',
		intent: 'Fun & Hookup',
		contextKeywords: ['hourly wage', 'stunning', 'elon musk', 'billionaire compliment', 'bold rizz']
	},
	{
		id: 'extra-018',
		text: 'I’m 6’1 in spirit and 5’10 in practical physics, but I have 10/10 banter if that compensates.',
		tone: 'Self-deprecating humor',
		category: 'Self-deprecating humor',
		intent: 'Casual Date',
		contextKeywords: ['height joke', 'physics', 'banter', 'honest profile', 'funny humor']
	},
	{
		id: 'extra-019',
		text: 'Let’s skip the part where we ask where we grew up and jump straight to who gets the aux on the road trip.',
		tone: 'Smooth',
		category: 'Music',
		intent: 'Casual Date',
		contextKeywords: ['skip small talk', 'aux cord', 'road trip', 'fast track date', 'smooth']
	},
	{
		id: 'extra-020',
		text: 'Bro really activated the Grimace Shake skibidi gyatt level 9000 over here.',
		tone: 'Brainrot',
		category: 'Photo reactions',
		intent: 'Neutral',
		contextKeywords: ['grimace shake', 'skibidi', 'level 9000', 'brainrot', 'comment']
	},
	{
		id: 'extra-021',
		text: 'You look like you make incredible life decisions with an occasional side of chaotic impulsive spending.',
		tone: 'Playful tease',
		category: 'Hobbies',
		intent: 'Casual Date',
		contextKeywords: ['impulsive spending', 'life decisions', 'chaotic good', 'teasing banter']
	},
	{
		id: 'extra-022',
		text: 'I’ll let you pick the restaurant as long as you promise we order at least two desserts to share.',
		tone: 'Smooth',
		category: 'Cooking',
		intent: 'Casual Date',
		contextKeywords: ['restaurant pick', 'dessert', 'sharing food', 'dinner date', 'sweet tooth']
	},
	{
		id: 'extra-023',
		text: 'I just deleted 12 different opening messages because none of them felt cool enough for your profile.',
		tone: 'Smooth',
		category: 'Bad Texters',
		intent: 'Casual Date',
		contextKeywords: ['deleted openers', 'overthinking', 'cool profile', 'vulnerable flirt', 'smooth']
	},
	{
		id: 'extra-024',
		text: 'Are you a morning person who runs at 6 AM or a night owl who contemplates the universe at 3 AM?',
		tone: 'Friendly',
		category: 'Late night texts',
		intent: 'Neutral',
		contextKeywords: ['morning person', 'night owl', 'sleep habits', 'personality type', 'icebreaker']
	},
	{
		id: 'extra-025',
		text: 'I’m officially drafting you onto my pub trivia team. Your specialty categories start now.',
		tone: 'Friendly',
		category: 'Hobbies',
		intent: 'Casual Date',
		contextKeywords: ['pub trivia', 'trivia team', 'drafting', 'casual date idea', 'bar game']
	},
	{
		id: 'extra-026',
		text: 'I’ll bet you a cocktail that I can guess your exact Starbucks order on the first try.',
		tone: 'Bold',
		category: 'Cooking',
		intent: 'Casual Date',
		contextKeywords: ['starbucks order', 'bet', 'cocktail', 'guessing game', 'bold invite']
	},
	{
		id: 'extra-027',
		text: 'You look like someone who owns at least 4 tote bags and has very strong opinions on oat milk.',
		tone: 'Playful tease',
		category: 'Hobbies',
		intent: 'Casual Date',
		contextKeywords: ['tote bags', 'oat milk', 'hipster', 'funny profiling', 'tease']
	},
	{
		id: 'extra-028',
		text: 'I’m not a professional photographer, but I can already picture us arguing over where to eat dinner.',
		tone: 'Smooth',
		category: 'Cooking',
		intent: 'A Relationship',
		contextKeywords: ['photographer', 'picture us', 'where to eat', 'cute couple banter', 'dinner']
	},
	{
		id: 'extra-029',
		text: 'I have an extra ticket to a comedy show and my friends are boring. Are you brave enough to join?',
		tone: 'Bold',
		category: 'Hobbies',
		intent: 'Casual Date',
		contextKeywords: ['comedy show', 'extra ticket', 'spontaneous invite', 'standup', 'date']
	},
	{
		id: 'extra-030',
		text: 'My ideal Sunday: farmers market, ridiculous amounts of iced coffee, and talking with you for hours.',
		tone: 'Smooth',
		category: 'Cooking',
		intent: 'A Relationship',
		contextKeywords: ['sunday routine', 'farmers market', 'iced coffee', 'hours of talking', 'romantic']
	},
	{
		id: 'extra-031',
		text: 'I’m willing to sign a legally binding contract guaranteeing that our first date will be at least an 8.5/10.',
		tone: 'Playful tease',
		category: 'Work/Tech',
		intent: 'Casual Date',
		contextKeywords: ['legally binding contract', 'guarantee', 'first date score', 'witty confidence']
	},
	{
		id: 'extra-032',
		text: 'You have that quiet confidence that instantly makes a room 50% more interesting.',
		tone: 'Smooth',
		category: 'Photo reactions',
		intent: 'A Relationship',
		contextKeywords: ['quiet confidence', 'presence', 'magnetic', 'deep compliment', 'charisma']
	},
	{
		id: 'extra-033',
		text: 'Bro is flexing that sigma Ohio mewing aura in the group chat ong.',
		tone: 'Brainrot',
		category: 'IG story replies',
		intent: 'Neutral',
		contextKeywords: ['sigma', 'ohio', 'mewing', 'group chat', 'brainrot', 'ong']
	},
	{
		id: 'extra-034',
		text: 'If you were a spice, you’d be smoked paprika: mysterious, adds flavor to everything, and looks great in photos.',
		tone: 'Playful tease',
		category: 'Cooking',
		intent: 'Fun & Hookup',
		contextKeywords: ['smoked paprika', 'spice', 'flavour', 'food pun', 'flirtatious']
	},
	{
		id: 'extra-035',
		text: 'I was having a completely average day until your notification popped up and completely derailed my focus.',
		tone: 'Smooth',
		category: 'Late night texts',
		intent: 'Fun & Hookup',
		contextKeywords: ['notification', 'derailed focus', 'average day', 'charming', 'flirty text']
	},
	{
		id: 'extra-036',
		text: 'I have a strict policy against talking to people who are prettier than me, but I’ll make a one-time exception.',
		tone: 'Playful tease',
		category: 'Photo reactions',
		intent: 'Fun & Hookup',
		contextKeywords: ['strict policy', 'one time exception', 'pretty', 'cocky tease', 'flirt']
	},
	{
		id: 'extra-037',
		text: 'If loving your music taste is wrong, I don’t ever want to be legally compliant.',
		tone: 'Unhinged',
		category: 'Music',
		intent: 'Fun & Hookup',
		contextKeywords: ['legally compliant', 'music taste', 'hyperbole', 'unhinged rizz']
	},
	{
		id: 'extra-038',
		text: 'Let’s go to a bookstore, pick out books for each other based purely on vibes, and read the first chapter over tea.',
		tone: 'Smooth',
		category: 'Hobbies',
		intent: 'Casual Date',
		contextKeywords: ['bookstore date', 'tea', 'book lovers', 'wholesome date', 'romantic']
	},
	{
		id: 'extra-039',
		text: 'I’m really good at two things: parallel parking on steep hills and making you laugh in under 3 minutes.',
		tone: 'Bold',
		category: 'Self-deprecating humor',
		intent: 'Casual Date',
		contextKeywords: ['parallel parking', 'make you laugh', 'confident', 'banter', 'bold starter']
	},
	{
		id: 'extra-040',
		text: 'I need your expert opinion: is it acceptable to put holiday decorations up in October or is that grounds for eviction?',
		tone: 'Friendly',
		category: 'Questions',
		intent: 'Neutral',
		contextKeywords: ['holiday decorations', 'october', 'expert opinion', 'seasonal debate', 'icebreaker']
	},
	{
		id: 'extra-041',
		text: 'I will literally climb Mount Everest in flip-flops if you promise to meet me at base camp with a warm cinnamon roll.',
		tone: 'Unhinged',
		category: 'Travel',
		intent: 'Fun & Hookup',
		contextKeywords: ['mount everest', 'flip flops', 'cinnamon roll', 'dramatic adventure', 'unhinged flirt']
	},
	{
		id: 'extra-042',
		text: 'I can’t tell if you’re super sweet or trouble with good PR, but I’m definitely willing to investigate.',
		tone: 'Smooth',
		category: 'Questions',
		intent: 'Casual Date',
		contextKeywords: ['trouble', 'good PR', 'sweet', 'investigate', 'smooth opener', 'banter']
	}
];
