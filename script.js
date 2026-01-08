// --- Database Logic (Global Scope) ---
const cardData = [
    { number: '001', name: 'Pandorama', cost: 'AA', rarity: '3', type: 'Landmark', set: 'Unity', location: 'L1', description: 'Your Card Limit is increased by 2.', lore: 'Those who reach the Pandorama shall behold the world anew.', image: 'images/pandorama.jpg' },
    { number: '002', name: 'Fountain of Youth', cost: 'GL', rarity: '3', type: 'Landmark', set: 'Unity', location: 'L2', description: 'Gain 1 Time Point whenever you draw 3 Cards in your End Phase.', lore: 'The blood of the innocent soaks the ground beneath.', image: 'images/fountain_of_youth.jpg' },
    { number: '003', name: "Dragura's Wasteland", cost: 'FFF', rarity: '3', type: 'Landmark', set: 'Unity', location: 'L3', description: 'During Construction Phase: You may discard a FireSteam to heal all damage from a Creature.', lore: '"To torment me, you torture yourself." - Dragura', image: 'images/draguras_wasteland.jpg' },
    { number: '004', name: 'Planetarium', cost: 'FGL', rarity: '3', type: 'Landmark', set: 'Unity' },
    { number: '005', name: 'Laser Catalyst', cost: 'LLLL', rarity: '3', type: 'Landmark', set: 'Unity', location: 'L5', description: "During End Phase: You may discard LaserSteams to deal 1 damage to any target. Artifacts can't be used in response to Laser Catalyst.", lore: 'There is no time to escape once laser beams appear on the ocean sky.', image: 'images/laser_catalyst.png' },
    { number: '006', name: "Lethargo's Temple", cost: 'AAAAA', rarity: '3', type: 'Landmark', set: 'Unity', location: 'L6', description: 'Once per Construction Phase: You may purchase Cards with Time Points in addition to Steams. Fire = 1 TP, Gold = 2 TP, Laser = 3 TP', lore: 'When entering the premises, one is overflown by the notion that this temple is older than time itself and will stand just as long.', image: 'images/lethargos_temple.png' },
    { number: '007', name: 'Clone Factory', cost: 'GGGGG', rarity: '3', type: 'Landmark', set: 'Unity', location: 'L7', description: 'During Creature Phase: Before your attack, you may discard a GoldSteam to attack twice in a row with a Creature.', lore: "No scholar escaped the factory's collapse. What transpired within remains forever unwritten." },
    { number: '008', name: 'Aetherlab', cost: 'FGGLL', rarity: '3', type: 'Landmark', set: 'Unity', location: 'L8', description: 'Once per Construction Phase: You may trade 1 FireSteam for a GoldSteam, or 1 GoldSteam for a LaserSteam in the Bazaar.', lore: 'Villagers were oblivious to the discovery made by a secretive alchemist.' },
    { number: '009', name: 'Ichor', cost: 'FF', rarity: '6', type: 'Creature', set: 'Unity', location: 'C1', description: '-', lore: 'The cunning creature hides its sharp claws under the soft fur.', health: '2' },
    { number: '010', name: 'Cravus', cost: 'GG', rarity: '6', type: 'Creature', set: 'Unity', location: 'C2', description: 'Cravus can attack instantly.', lore: 'Steel-forged feathers, shot from its wings, are the only trace Cravus leaves behind.', health: '2' },
    { number: '011', name: 'Entrophy', cost: 'AAA', rarity: '3', type: 'Creature', set: 'Unity', location: 'C3', description: 'After targeting a player to attack, roll a die.<br>1: No additional effect.<br>2: Unblockable<br>3: +3 Strength<br>4: +4 Time Points<br>5: Comes to the Hand of the Opponent<br>6: Attacks you', lore: 'It can show you the way through the cave. But never out.', health: '2' },
    { number: '012', name: 'Meridius', cost: 'GGG', rarity: '6', type: 'Creature', set: 'Unity', location: 'C4', description: "During your Attack: Meridius gains +1 Strength for each Landmark the defending Player owns. If they own 3 or more, Meridius can't be blocked.", lore: 'Rula taught him that victory in battle is penned by experience, not found in the pages of any book. Beyond words, it is known only through magic.', health: '2+' },
    { number: '013', name: 'Meridia', cost: 'FFL', rarity: '6', type: 'Creature', set: 'Unity', location: 'C5', description: 'Meridia gains +1 Health Point for each Artifact in your History Pile. When Meridia takes damage, sacrifice her and prevent remaining damage.', lore: 'As the last living witch, Meridia unleashes the magic of her fallen predecessors.', health: '0+' },
    { number: '014', name: 'Time Thief', cost: 'GGL', rarity: '3', type: 'Creature', set: 'Unity', location: 'C6', description: 'When Time Thief deals damage, gain an equal amount of Time Points.', lore: 'His identity is forged like her armour—in patient precision.', health: '3' },
    { number: '015', name: 'Rampadon', cost: 'FGGG', rarity: '3', type: 'Creature', set: 'Unity', location: 'C7', description: "Rampadon can attack instantly and can't be blocked.", lore: 'Thirst will be the least of ones concerns when wandering through Pelago Desert.', health: '3' },
    { number: '016', name: 'Vulcanem', cost: 'FFLL', rarity: '3', type: 'Creature', set: 'Unity', location: 'C8', description: '-', lore: 'In ancient myths, Vulcanem was known as the Fire Devil, bringing suffering to any explorer who sought his treasures.', health: '6' },
    { number: '017', name: 'Smoke', cost: 'FF', rarity: '6', type: 'Artifact', set: 'Unity', location: 'A1', description: "When you're being attacked: Creatures attacking you have -1 Strength this turn.", lore: 'In the smoke, your shadow might run away.' },
    { number: '018', name: 'Dark Matter', cost: 'FGL', rarity: '6', type: 'Artifact', set: 'Unity', location: 'A2', description: 'In your Construction Phase: Draw a Card. Then, a player of your choice must choose between sacrificing a Creature, discarding a Card, or losing 2 Time Points.', lore: 'It appears out of nowhere and pulls its target closer to the abyss of the universe.' },
    { number: '019', name: 'Reflector', cost: 'FLL', rarity: '3', type: 'Artifact', set: 'Unity', location: 'A3', description: "When you're being attacked: Change the attack target to a Player of your choice.", lore: 'Defense is the best offense.' },
    { number: '020', name: 'Talisman', cost: 'FGGGL', rarity: '3', type: 'Artifact', set: 'Unity', location: 'A4', description: 'When being targeted: Prevent a Card that targets you or any of your Cards. A prevented Creature or Artifact is placed in the History Pile. A prevented Spark Card is sent to the Abyss.', lore: "In the War of Foreign Times, the Talisman was Amphion's last resort to defeat Lethargo." },
    { number: '021', name: 'Reversal', cost: 'FGG', rarity: '6', type: 'Spark', set: 'Unity', location: 'S1', description: 'Take a Card from your History Pile and place it in your Hand.', lore: 'There is a space where one has died. And in its place new life will thrive' },
    { number: '022', name: 'Faith', cost: 'GGG', rarity: '6', type: 'Spark', set: 'Unity', location: 'S2', description: 'Draw a Card. Gain 3 Time Points.', lore: 'It takes some sacrifice. To sail against the wind of change. Before I close my eyes. I hold my hands up to your faith' },
    { number: '023', name: 'Threat', cost: 'FGL', rarity: '6', type: 'Spark', set: 'Unity', location: 'S3', description: 'Send an active Landmark of your choice to the Abyss, unless its owner pays 2 Time Points for each Landmark they own.', lore: 'A deal with Dragura always ends in a loss.' },
    { number: '024', name: 'Confiscation', cost: 'GGLL', rarity: '6', type: 'Spark', set: 'Unity', location: 'S4', description: "Look at target Opponent's Hand and take one Card to your Hand.", lore: 'Eventually, every entity will find its true owner.' },
    { number: '025', name: 'Healing Tree', cost: '', rarity: '1', type: 'Destiny', set: 'Unity', location: 'D', description: 'Each Player may discard any number of Cards on their Hand to obtain an equal number of Time Points.' },
    { number: '026', name: 'Freeze', cost: '', rarity: '1', type: 'Destiny', set: 'Unity', location: 'D', description: 'This turn ends directly. Draw only 1 Card in your End Phase.' },
    { number: '027', name: 'Dragon Throne', cost: '', rarity: '1', type: 'Destiny', set: 'Unity', location: 'D', description: 'Choose an opponent. Take a random Card from their Hand and place it in yours.' },
    { number: '028', name: 'Unstoppable Force', cost: '', rarity: '1', type: 'Destiny', set: 'Unity', location: 'D', description: "In this turn, your Creatures heave +1 Strength and can't be blocked. Other Players can't use Artifacts in response." },
    { number: '029', name: 'Truce', cost: '', rarity: '1', type: 'Destiny', set: 'Unity', location: 'D', description: "Your Creatures can't attack this turn." },
    { number: '030', name: 'Voider', cost: '', rarity: '1', type: 'Destiny', set: 'Unity', location: 'D', description: 'Each Player may send up to 2 Cards from their History Pile into the Abyss.' },
    { number: '031', name: 'Space Voider', cost: '', rarity: '1', type: 'Destiny', set: 'Unity', location: 'D', description: 'Each Player may send up to 4 Cards from their History Pile into the Abyss.' },
    { number: '032', name: 'Eternal Hour', cost: '', rarity: '1', type: 'Destiny', set: 'Unity', location: 'D', description: 'All Players tied for most Time Points lose 4.' },
    { number: '033', name: 'Great Flood', cost: '', rarity: '1', type: 'Destiny', set: 'Unity', location: 'D', description: 'Each Player must send one of their Landmarks into the Abyss.' },
    { number: '034', name: 'Laser Bomb', cost: '', rarity: '1', type: 'Destiny', set: 'Unity', location: 'D', description: 'Send all Creatures from the Creature Zone into the Abyss.' },
    { number: '035', name: "Daredevil's Reward", cost: '', rarity: '1', type: 'Destiny', set: 'Unity', location: 'D', description: 'All Players tied for least Time Points may show a Card from their Hand to take the same Card from the Bazaar.' },
    { number: '036', name: "Lethargo's Approach", cost: '', rarity: '1', type: 'Destiny', set: 'Unity', location: 'D', description: 'Each Player loses 1 Time Point.' },
    { number: '037', name: 'Sacrifice', cost: '', rarity: '1', type: 'Destiny', set: 'Unity', location: 'D', description: 'Roll a Futory Die. You lose Time Points equal to the result.' },
    { number: '038', name: 'Break of Dawn', cost: '', rarity: '1', type: 'Destiny', set: 'Unity', location: 'D', description: 'Roll a Futory Die. You gain Time Points equal to the result.' },
    { number: '039', name: 'Sandstorm', cost: '', rarity: '1', type: 'Destiny', set: 'Unity', location: 'D', description: 'All Landmarks on the Playing Field are deactivated. Once per Construction Phase a Player may reactivate 1 Landmark.' },
    { number: '040', name: 'Wormhole', cost: '', rarity: '1', type: 'Destiny', set: 'Unity', location: 'D', description: 'Each Player shuffles Creature Zone, Landmark Zone, Hand, History Pile and Future Pile to a new Future Pile. Then each Player draws 3 Cards.' },
    { number: '041', name: "Dragura's Command", cost: '', rarity: '1', type: 'Destiny', set: 'Unity', location: 'D', description: 'Each Player discards 1 Card from their Hand.' },
    { number: '042', name: "Rula's Support", cost: '', rarity: '1', type: 'Destiny', set: 'Unity', location: 'D', description: 'Each Player draws 1 Card.' },
    { number: '043', name: 'Contermination', cost: '', rarity: '1', type: 'Destiny', set: 'Unity', location: 'D', description: 'Turn over a Non-Steam Pile from the Bazaar to make in inaccessible for purchases.' },
    { number: '044', name: "Noctura's Night", cost: '', rarity: '1', type: 'Destiny', set: 'Unity', location: 'D', description: 'Each Player removes their Day Die.' },
    { number: '045', name: 'Sunken City', cost: '', rarity: '1', type: 'Destiny', set: 'Unity', location: 'D', description: 'Each Player may take 1 Card from their History Pile to their Hand.' },
    { number: '046', name: "Kyro's Destiny", cost: '', rarity: '1', type: 'Destiny', set: 'Unity', location: 'D', description: 'Play a Spark Card of your choice from the Bazaar.' },
    { number: '047', name: 'Chrono Machine', cost: '', rarity: '1', type: 'Destiny', set: 'Unity', location: 'D', description: 'After your turn ends, you get an additional turn.' },
    { number: '048', name: "Meridia's Revenge", cost: '', rarity: '1', type: 'Destiny', set: 'Unity', location: 'D', description: "Deal 1 Damage to a Target Player for each Artifact in their History Pile. Artifacts can't be used in response." },
    { number: '049', name: 'Time Bender', cost: 'GG', rarity: '3', type: 'Landmark', set: 'Duality', location: 'L1', description: 'Once per Construction Phase, you may switch your active Time Die.' },
    { number: '050', name: "Meridia's Cabin", cost: 'FFG', rarity: '3', type: 'Landmark', set: 'Duality', location: 'L2', description: 'If you have Artifacts at the top of your History Pile, or unoccupied in your Creature Zone, your Creatures gain +1 Health Points for each Artifact.' },
    { number: '051', name: 'Repo Station', cost: 'FGL', rarity: '3', type: 'Landmark', set: 'Duality', location: 'L3', description: "Each time you defeat an opponent's Creature, or sacrifice your own with Repo Station, gain 1 Time Point." },
    { number: '052', name: 'Gravitas', cost: 'GLL', rarity: '3', type: 'Landmark', set: 'Duality', location: 'L4', description: 'Whenever you shuffle your History Pile to form a new Future Pile, draw Cards until you reach your Hand Limit.' },
    { number: '053', name: 'Hand of Rhone', cost: 'LLLL', rarity: '3', type: 'Landmark', set: 'Duality', location: 'L5', description: 'During your Construction Phase, you may charge this Landmark with 1 Force. To deal damage, remove the counting Futory Die and choose a direction. The Force deals 1 damage to every Player it passes continuing for the charged distance. When 6 is reached, you heal instead of taking damage from it.' },
    { number: '054', name: 'Atlantica', cost: 'AAAAA', rarity: '3', type: 'Landmark', set: 'Duality', location: 'L6', description: 'You may place Cards from your Hand behind active Landmarks face up. If a Landmark gets deactivated or destroyed, the connected Card is discarded. Only 1 Card can be connected to each Landmark. Atlantica cannot be deactivated.' },
    { number: '055', name: 'Hyperscope', cost: 'GGGL', rarity: '3', type: 'Landmark', set: 'Duality', location: 'L7', description: 'Target any Player, Creature, or Landmark directly during your attack. To destroy a Landmark, the attacks in one turn must be equal or higher than the Price of the Landmark.' },
    { number: '056', name: 'Pyralos', cost: 'GGGLL', rarity: '3', type: 'Landmark', set: 'Duality', location: 'L8', description: 'Once per Construction Phase: You may send 1 of your Cards into the Abyss to look at the top 6 Cards in any Future Pile and rearrange them. Then, draw a Card.' },
    { number: '057', name: 'Chrona', cost: '', rarity: '6', type: 'Creature', set: 'Duality', location: 'C1', description: '[Strength Placeholder] [Resistance Placeholder] When Chrona enters the Creature Zone, you may redistribute its Health Points between Strength and Resistance.', health: '2' },
    { number: '058', name: 'Razo', cost: 'GG', rarity: '6', type: 'Creature', set: 'Duality', location: 'C2', description: "Razo can't be deactivated.", health: '3' },
    { number: '059', name: 'Looper', cost: 'AGG', rarity: '3', type: 'Creature', set: 'Duality', location: 'C3', description: 'Attack multiple times by rolling a Futory Die. Any additional effects only apply to the first attack.', health: '1' },
    { number: '060', name: 'Aromeas', cost: 'GGG', rarity: '6', type: 'Creature', set: 'Duality', location: 'C4', description: 'Aromeas Health Points become half of the Time Points of your active Time Die upon entering the Creature Zone.', health: 'X' },
    { number: '061', name: 'Masiota', cost: 'FFL', rarity: '6', type: 'Creature', set: 'Duality', location: 'C5', description: "Instead of discarding, you may choose to deactivate Masiota. When you reactivate him in the next turn, reduce Masiota's Health Points by 1 for each time you have used this effect.", health: '3' },
    { number: '062', name: 'General Wave', cost: 'LL', rarity: '6', type: 'Creature', set: 'Duality', location: 'C6', description: '-', health: '4' },
    { number: '063', name: 'Namandi', cost: '', rarity: '3', type: 'Creature', set: 'Duality', location: 'C7', description: 'Namandi gains +1 Strength for each Non-Steam Card you discard while attacking.', health: '3' },
    { number: '064', name: 'Aqualon', cost: 'GGGLL', rarity: '3', type: 'Creature', set: 'Duality', location: 'C8', description: 'After Aqualon attacks and is discarded, you may shuffle your History Pile and Future Pile into a new Future Pile.', health: '6' },
    { number: '065', name: 'Sleep Potion', cost: 'FF', rarity: '6', type: 'Artifact', set: 'Duality', location: 'A1', description: 'In your Construction Phase or Creature Phase: You may deactivate a Creature or a Landmark of your choice. (If you target a deactivated Card, it gets discarded.) (You may deactivate your Creature to keep it anonymous when bringing it into battle.)' },
    { number: '066', name: 'Lotus', cost: 'FGL', rarity: '6', type: 'Artifact', set: 'Duality', location: 'A2', description: 'In your Construction Phase: You may lay Lotus next to the center of your Creature Zone. You can place an additional Creature on this Artifact. (When the Creature is defeated or sacrificed, Lotus is also discarded.)' },
    { number: '067', name: 'Rush', cost: 'FLL', rarity: '3', type: 'Artifact', set: 'Duality', location: 'A3', description: 'In your Creature Phase: Make a Creature attack instantly.' },
    { number: '068', name: 'Cell Shield', cost: 'GGGLL', rarity: '3', type: 'Artifact', set: 'Duality', location: 'A4', description: "When you're being attacked: Prevent all Time Points that you would loose from an attack and draw Cards equal to that amount." },
    { number: '069', name: 'Tame Beast', cost: 'GGG', rarity: '6', type: 'Spark', set: 'Duality', location: 'S1', description: 'Reduce the Health Points of any Creature in play to 1 and gain the deduced Time Points.' },
    { number: '070', name: 'Tele Control', cost: 'FGL', rarity: '6', type: 'Spark', set: 'Duality', location: 'S2', description: 'Use an active Creature to attack a Player of your choice. The controlled Creature is not discarded.' },
    { number: '071', name: 'Alchemy', cost: 'AGGG', rarity: '6', type: 'Spark', set: 'Duality', location: 'S3', description: 'A Player of your choice has to discard all Cards from their Landmark Zone.' },
    { number: '072', name: 'Burden of Wealth', cost: 'GGLL', rarity: '6', type: 'Spark', set: 'Duality', location: 'S4', description: 'Target damage to a Player equal to the Cards in their Hand. They may reduce damage by discarding Cards, from most expensive to least. (Expensiveness is measured first by total Steams used, then by value of Steams. E.g. FFL is worth more than GGG because Laser beats all Gold when the amount is the same. Therefore FFF beats GL).' },
    { number: '073', name: 'Cosmic Eclipse', cost: '', rarity: '1', type: 'Destiny', set: 'Duality', location: 'D', description: 'Roll your active Time Die to change your Time Points.' },
    { number: '074', name: 'Fortunate Verdict', cost: '', rarity: '1', type: 'Destiny', set: 'Duality', location: 'D', description: 'Vote which Player gains 1 Time Point. Your vote counts twice. If it ends in a draw, nobody gains a Time Point.' },
    { number: '075', name: 'Unfortunate Verdict', cost: '', rarity: '1', type: 'Destiny', set: 'Duality', location: 'D', description: 'Vote which Player has to lose 1 Time Point. Your vote counts twice. If it ends in a draw, nobody loses a Time Point.' },
    { number: '076', name: 'Missing Merchants', cost: '', rarity: '1', type: 'Destiny', set: 'Duality', location: 'D', description: 'Until the beginning of your next turn, the Bazaar remains closed.' },
    { number: '077', name: 'Scorched Planet', cost: '', rarity: '1', type: 'Destiny', set: 'Duality', location: 'D', description: 'Decide whether all Players must discard their Fire-, Gold-, or LaserSteam.' },
    { number: '078', name: 'Blind Raider', cost: '', rarity: '1', type: 'Destiny', set: 'Duality', location: 'D', description: 'Draw a Card from any Future Pile in the game.' },
    { number: '079', name: 'Natureon', cost: '', rarity: '1', type: 'Destiny', set: 'Duality', location: 'D', description: 'The Players with the least Landmarks gain Time Points equal to their amount of Landmarks.' },
    { number: '080', name: 'Trade', cost: '', rarity: '1', type: 'Destiny', set: 'Duality', location: 'D', description: 'Each Player chooses 2 Non-Steam Cards from their Hand and shows them to the others. Starting with you, Players take any Card to their Hand by giving the required Steam to the Hand of the Seller.' },
    { number: '081', name: 'Refill', cost: '', rarity: '1', type: 'Destiny', set: 'Duality', location: 'D', description: 'Each Player may take 1 Steam of their choice to their Hand.' },
    { number: '082', name: 'Royal Privilege', cost: '', rarity: '1', type: 'Destiny', set: 'Duality', location: 'D', description: 'Place this Card on any Non-Steam Pile in the Bazaar to reserve it for your future purchase. Once bought, remove Royal Privilege and reopen the Pile to all Players.' },
    { number: '083', name: 'Ashes to Flesh', cost: '', rarity: '1', type: 'Destiny', set: 'Duality', location: 'D', description: 'Players whose History Pile is larger or equal to their Future Pile, swap them by laying the Future Pile face up and replacing it with the shuffled History Pile.' },
    { number: '084', name: 'Looking Glass', cost: '', rarity: '1', type: 'Destiny', set: 'Duality', location: 'D', description: 'Until your next turn, your Opponents have to play with an Open Hand.' },
    { number: '085', name: 'Vortex', cost: '', rarity: '1', type: 'Destiny', set: 'Duality', location: 'D', description: 'The direction of the game changes.' },
    { number: '086', name: "Amphion's Fog", cost: '', rarity: '1', type: 'Destiny', set: 'Duality', location: 'D', description: 'Lay this Card in the Destiny Zone above the Bazaar. Players can only attack adjacent Players for the remaining game.' },
    { number: '087', name: 'Will of Sarus', cost: '', rarity: '1', type: 'Destiny', set: 'Duality', location: 'D', description: 'Target 2 Players who have to swap their Hand.' },
    { number: '088', name: 'Lost Souls', cost: '', rarity: '1', type: 'Destiny', set: 'Duality', location: 'D', description: 'Lay this Card in the Destiny Zone above the Bazaar. The Cards of all defeated Players will be put back into the Bazaar for the remaining game.' },
    { number: '089', name: "Dragon's Apprentice", cost: '', rarity: '1', type: 'Destiny', set: 'Duality', location: 'D', description: 'Choose a Player. Place a random Card from their Hand into your History Pile.' },
    { number: '090', name: 'Scavenger', cost: '', rarity: '1', type: 'Destiny', set: 'Duality', location: 'D', description: 'Take the last discarded Creature from your History Pile to your Hand.' },
    { number: '091', name: 'Surge', cost: '', rarity: '1', type: 'Destiny', set: 'Duality', location: 'D', description: 'Make up to 3 purchases in your Steam Phase.' },
    { number: '092', name: 'Resurrection', cost: '', rarity: '1', type: 'Destiny', set: 'Duality', location: 'D', description: 'Take a Card from the Abyss and place it in your History Pile.' },
    { number: '093', name: 'Pathways', cost: '', rarity: '1', type: 'Destiny', set: 'Duality', location: 'D', description: 'Shuffle the cards from the Destiny Abyss back into the main Destiny Pile. Form two equal Destiny Piles by splitting the deck in half. From now on, Players may choose a Pile and draw 1 card. They may either resolve that card immediately or draw from the second Pile that must be resolved.' },
    { number: '094', name: '(Coming soon)', cost: '', rarity: '1', type: 'Destiny', set: 'Duality' },
    { number: '095', name: '(Coming soon)', cost: '', rarity: '1', type: 'Destiny', set: 'Duality' },
    { number: '096', name: '(Coming soon)', cost: '', rarity: '1', type: 'Destiny', set: 'Duality' }
];

document.addEventListener('DOMContentLoaded', () => {
    // --- Parallax Effect ---
    const stars = document.querySelector('.stars');
    const twinkling = document.querySelector('.twinkling');

    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;

        stars.style.transform = `translate(${x}px, ${y}px)`;
        twinkling.style.transform = `translate(${x * 2}px, ${y * 2}px)`;
    });

    // --- Navigation Logic ---
    const screens = {
        home: document.getElementById('home-screen'),
        localMode: document.getElementById('local-mode-screen'),
        setup: document.getElementById('setup-screen'),
        game: document.getElementById('game-screen'),
        database: document.getElementById('database-screen'),
        events: document.getElementById('events-screen'),
        rules: document.getElementById('rules-screen'),
        construction: document.getElementById('construction-screen')
    };

    function showScreen(screenName) {
        // Hide all screens
        Object.values(screens).forEach(screen => {
            if (screen) {
                screen.classList.remove('active');
                screen.classList.add('hidden');
            }
        });

        // Show target screen
        if (screens[screenName]) {
            screens[screenName].classList.remove('hidden');
            // Small timeout to allow display:flex to apply before opacity transition
            setTimeout(() => {
                screens[screenName].classList.add('active');
            }, 10);
        } else {
            console.error(`Screen not found: ${screenName}`);
        }

        // Toggle Header Visibility
        const header = document.getElementById('main-header');
        if (screenName === 'game') {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
    }

    // Home Screen Buttons
    document.getElementById('btn-play').addEventListener('click', () => {
        // Clear previous input/error
        document.getElementById('password-input').value = '';
        document.getElementById('password-error').style.opacity = '0';
        openModal('password');
        // Auto-focus input
        setTimeout(() => document.getElementById('password-input').focus(), 100);
    });
    document.getElementById('btn-rules').addEventListener('click', () => showScreen('rules'));
    document.getElementById('btn-back-sa').addEventListener('click', () => {
        window.location.href = 'https://simonallmer.com';
    });

    // Title click to go home
    const gameTitle = document.querySelector('.game-title');
    if (gameTitle) {
        gameTitle.style.cursor = 'pointer';
        gameTitle.addEventListener('click', () => showScreen('home'));
    }

    // Database & Events Buttons
    const menuButtons = document.querySelectorAll('.main-menu .menu-btn');

    Array.from(menuButtons).forEach(btn => {
        if (btn.textContent.includes('Database')) {
            btn.classList.remove('disabled');
            btn.removeAttribute('data-tooltip');
            btn.addEventListener('click', () => {
                populateDatabase();
                showScreen('database');
            });
        }
        if (btn.textContent.includes('Events')) {
            btn.classList.remove('disabled');
            btn.removeAttribute('data-tooltip');
            btn.addEventListener('click', () => showScreen('events'));
        }
    });

    // Local Mode Screen Buttons
    document.getElementById('btn-mode-human').addEventListener('click', () => showScreen('setup'));

    // Handle "Back" buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Determine where to go back to based on current visibility
            if (screens.setup.classList.contains('active')) {
                showScreen('localMode');
            } else if (screens.localMode.classList.contains('active')) {
                showScreen('home');
            } else if (screens.database.classList.contains('active')) {
                showScreen('home');
            } else if (screens.events.classList.contains('active')) {
                showScreen('home');
            } else if (screens.rules.classList.contains('active')) {
                showScreen('home');
            } else if (screens.construction.classList.contains('active')) {
                showScreen('home');
            } else if (screens.game.classList.contains('active')) {
                showScreen('home');
            }
        });
    });

    // --- Setup Screen Logic ---
    document.querySelectorAll('input[name="sets"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const label = e.target.closest('.checkbox-btn');
            e.target.checked ? label.classList.add('selected') : label.classList.remove('selected');
        });
    });

    document.querySelectorAll('input[name="time"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.querySelectorAll('.radio-btn').forEach(lbl => lbl.classList.remove('selected'));
            if (e.target.checked) e.target.closest('.radio-btn').classList.add('selected');
        });
    });

    // Start Game Button
    const btnStartGame = document.getElementById('btn-start-game');
    if (btnStartGame) {
        btnStartGame.addEventListener('click', () => {
            try {
                startGame();
            } catch (error) {
                console.error("Error starting game:", error);
                alert("Error starting game: " + error.message);
            }
        });
    } else {
        console.error("Start Game button not found!");
    }

    // --- Rules Page Logic ---
    // Tab switching
    const tabGeneralRules = document.getElementById('tab-general-rules');
    const tabKeywords = document.getElementById('tab-keywords');
    const generalRulesContent = document.getElementById('general-rules-content');
    const keywordsContent = document.getElementById('keywords-content');

    if (tabGeneralRules && tabKeywords) {
        tabGeneralRules.addEventListener('click', () => {
            tabGeneralRules.classList.add('active');
            tabKeywords.classList.remove('active');
            generalRulesContent.classList.add('active');
            generalRulesContent.classList.remove('hidden');
            keywordsContent.classList.remove('active');
            keywordsContent.classList.add('hidden');
        });

        tabKeywords.addEventListener('click', () => {
            tabKeywords.classList.add('active');
            tabGeneralRules.classList.remove('active');
            keywordsContent.classList.add('active');
            keywordsContent.classList.remove('hidden');
            generalRulesContent.classList.remove('active');
            generalRulesContent.classList.add('hidden');
        });
    }

    // Keyword accordion functionality
    document.querySelectorAll('.keyword-header').forEach(header => {
        header.addEventListener('click', () => {
            const keywordItem = header.closest('.keyword-item');
            const description = keywordItem.querySelector('.keyword-description');

            // Toggle expanded state
            keywordItem.classList.toggle('expanded');
            description.classList.toggle('hidden');
        });
    });

    // Keyword info panel functionality (for modal)
    const keywordInfoPanelModal = document.getElementById('keyword-info-panel-modal');
    const keywordInfoTitleModal = document.getElementById('keyword-info-title-modal');
    const keywordInfoContentModal = document.getElementById('keyword-info-content-modal');
    const closeKeywordInfoModal = document.getElementById('close-keyword-info-modal');

    // Function to show keyword info in modal side panel
    window.navigateToKeyword = function (keywordId) {
        // Don't close the modal - keep the card open!

        // Get keyword data from the Rules page
        const keywordItem = document.querySelector(`[data-keyword="${keywordId}"]`);
        if (keywordItem) {
            const keywordName = keywordItem.querySelector('.keyword-name').textContent;
            const keywordDesc = keywordItem.querySelector('.keyword-description p').textContent;

            // Update modal panel content
            keywordInfoTitleModal.textContent = keywordName;
            keywordInfoContentModal.innerHTML = `<p>${keywordDesc}</p>`;

            // Show modal panel
            keywordInfoPanelModal.classList.remove('hidden');
        }
    };

    // Close keyword info modal panel
    if (closeKeywordInfoModal) {
        closeKeywordInfoModal.addEventListener('click', () => {
            keywordInfoPanelModal.classList.add('hidden');
        });
    }

    // --- Game Logic ---
    let currentPhase = 0; // 0: Steam, 1: Construction, 2: Creature, 3: End

    function startGame() {
        console.log("Starting game...");
        renderBazaar();
        resetGameUI();
        showScreen('game');
    }

    function resetGameUI() {
        currentPhase = 0;
        updatePhaseUI();

        // Reset Hand Window
        const handWindow = document.getElementById('hand-window');
        const toggleText = handWindow.querySelector('.toggle-text');
        const toggleIcon = handWindow.querySelector('.toggle-icon');

        // Open by default
        handWindow.classList.remove('collapsed');
        toggleText.textContent = "Close Hand";
        toggleIcon.textContent = "▼";
    }

    // Phase Logic
    document.getElementById('btn-next-phase').addEventListener('click', () => {
        currentPhase = (currentPhase + 1) % 4;
        updatePhaseUI();
    });

    function updatePhaseUI() {
        const steps = document.querySelectorAll('.phase-step');
        steps.forEach((step, index) => {
            if (index === currentPhase) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    // Hand Window Logic
    const btnToggleHand = document.getElementById('btn-toggle-hand');
    const handWindow = document.getElementById('hand-window');

    btnToggleHand.addEventListener('click', () => {
        handWindow.classList.toggle('collapsed');
        const isCollapsed = handWindow.classList.contains('collapsed');
        const toggleText = handWindow.querySelector('.toggle-text');
        const toggleIcon = handWindow.querySelector('.toggle-icon');

        if (isCollapsed) {
            toggleText.textContent = "Open Hand";
            toggleIcon.textContent = "▲";
        } else {
            toggleText.textContent = "Close Hand";
            toggleIcon.textContent = "▼";
        }
    });

    function renderBazaar() {
        const row1 = document.getElementById('bazaar-row-1');
        const row2 = document.getElementById('bazaar-row-2');
        const row3 = document.getElementById('bazaar-row-3');

        if (!row1 || !row2 || !row3) {
            console.error("Bazaar rows not found!");
            return;
        }

        // Clear existing content
        row1.innerHTML = '';
        row2.innerHTML = '';
        row3.innerHTML = '';

        if (typeof cardData === 'undefined') {
            throw new Error("cardData is undefined");
        }

        // Filter Unity cards
        const unityCards = cardData.filter(card => card.set === 'Unity');

        // Row 1: 8 Landmarks (001-008)
        const landmarks = unityCards.filter(card => card.type === 'Landmark').slice(0, 8);
        landmarks.forEach(card => row1.appendChild(createGameCard(card)));

        // Row 2: 8 Creatures (009-016)
        const creatures = unityCards.filter(card => card.type === 'Creature').slice(0, 8);
        creatures.forEach(card => row2.appendChild(createGameCard(card)));

        // Row 3: 4 Artifacts (017-020) + 4 Sparks (021-024)
        const artifacts = unityCards.filter(card => card.type === 'Artifact').slice(0, 4);
        const sparks = unityCards.filter(card => card.type === 'Spark').slice(0, 4);

        artifacts.forEach(card => row3.appendChild(createGameCard(card)));
        sparks.forEach(card => row3.appendChild(createGameCard(card)));
    }

    function createGameCard(card) {
        const cardEl = document.createElement('div');
        cardEl.className = `game-card type-${card.type.toLowerCase()}`;

        let icon = '';
        switch (card.type) {
            case 'Landmark': icon = '🏛️'; break;
            case 'Creature': icon = '🐉'; break;
            case 'Artifact': icon = '🔮'; break;
            case 'Spark': icon = '⚡'; break;
            default: icon = '🃏';
        }

        cardEl.innerHTML = `
            <div class="card-top">
                <span>${card.number}</span>
                <span>${card.cost || '-'}</span>
            </div>
            <div class="card-type-icon">${icon}</div>
            <div class="card-name">${card.name}</div>
        `;

        // Add click handler for popup details
        cardEl.addEventListener('click', () => showCardPopup(card));

        return cardEl;
    }

    function populateDatabase() {
        const tbody = document.getElementById('database-body');
        if (tbody.children.length > 0) return; // Already populated

        cardData.forEach(card => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${card.number}</td>
                <td><span class="card-link" data-number="${card.number}">${card.name}</span></td>
                <td>${card.cost}</td>
                <td>${card.rarity}</td>
                <td>${card.type}</td>
                <td>${card.set}</td>
            `;
            tbody.appendChild(tr);
        });

        // Add click listeners to card links
        document.querySelectorAll('.card-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const number = e.target.dataset.number;
                const card = cardData.find(c => c.number === number);
                if (card) showCardPopup(card);
            });
        });
    }

    // Search functionality for database
    const searchInput = document.getElementById('database-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            const tbody = document.getElementById('database-body');
            const rows = tbody.querySelectorAll('tr');

            rows.forEach(row => {
                const nameCell = row.querySelector('td:nth-child(2)');
                if (nameCell) {
                    const cardName = nameCell.textContent.toLowerCase();
                    if (cardName.includes(searchTerm)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        });
    }

    // --- Modal Logic ---
    const modalOverlay = document.getElementById('modal-overlay');
    const modals = {
        profile: document.getElementById('modal-profile'),
        options: document.getElementById('modal-options'),
        credits: document.getElementById('modal-credits'),
        cardPopup: document.getElementById('modal-card-popup'),
        password: document.getElementById('modal-password') // Added password modal
    };

    function showCardPopup(card) {
        document.getElementById('popup-card-name').textContent = card.name;
        document.getElementById('popup-card-type').textContent = card.type;
        document.getElementById('popup-card-cost').textContent = card.cost || '-';
        document.getElementById('popup-card-rarity').textContent = card.rarity;
        document.getElementById('popup-card-set').textContent = card.set;
        document.getElementById('popup-card-number').textContent = card.number;
        document.getElementById('popup-card-location').textContent = card.location || '-';

        // Handle description with keyword links
        const descElement = document.getElementById('popup-card-desc');
        if (card.description) {
            let description = card.description;

            // Define keywords to link
            const keywords = {
                'Time Point': 'time-points',
                'Time Points': 'time-points',
                'End Phase': 'end-phase',
                'Health Points': 'health-points',
                'Steam Phase': 'steam-phase',
                'Construction Phase': 'construction-phase',
                'Creature Phase': 'creature-phase'
            };

            // Replace keywords with clickable links
            Object.keys(keywords).forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
                description = description.replace(regex, match => {
                    return `<span class="keyword-link" onclick="navigateToKeyword('${keywords[keyword]}')">${match}</span>`;
                });
            });

            descElement.innerHTML = description;
        } else {
            descElement.textContent = '-';
        }

        document.getElementById('popup-card-lore').textContent = card.lore || '-';

        // Handle card image
        const imageContainer = document.getElementById('popup-card-image-container');
        const imageElement = document.getElementById('popup-card-image');

        if (card.image) {
            imageElement.src = card.image;
            imageContainer.classList.remove('hidden');
        } else {
            imageContainer.classList.add('hidden');
        }

        openModal('cardPopup');
    }

    function openModal(modalName) {
        Object.values(modals).forEach(m => m.classList.add('hidden'));
        modalOverlay.classList.remove('hidden');
        if (modals[modalName]) modals[modalName].classList.remove('hidden');
    }

    function closeModal() {
        modalOverlay.classList.add('hidden');
        Object.values(modals).forEach(m => m.classList.add('hidden'));
    }

    document.getElementById('btn-profile').addEventListener('click', () => openModal('profile'));
    document.getElementById('btn-options').addEventListener('click', () => openModal('options'));
    document.getElementById('btn-credits').addEventListener('click', () => openModal('credits'));

    // Password Authentication Logic
    const passwordInput = document.getElementById('password-input');
    const submitPasswordBtn = document.getElementById('btn-submit-password');
    const passwordError = document.getElementById('password-error');

    function checkPassword() {
        if (passwordInput.value === '2020') {
            closeModal();
            showScreen('localMode');
        } else {
            passwordError.style.opacity = '1';
            passwordError.style.display = 'block';

            // Shake effect
            const content = document.querySelector('#modal-password .modal-content');
            content.style.animation = 'shake 0.4s';
            setTimeout(() => content.style.animation = '', 400);

            passwordInput.value = '';
            passwordInput.focus();
        }
    }

    submitPasswordBtn.addEventListener('click', checkPassword);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkPassword();
    });


    document.querySelectorAll('.close-modal').forEach(btn => btn.addEventListener('click', closeModal));
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // --- Slider Logic ---
    document.querySelectorAll('.slider-container').forEach(container => {
        const slider = container.querySelector('input[type="range"]');
        // No value display needed as per design, just ticks
    });

    // --- Generic Disabled Button Handler ---
    const disabledButtons = document.querySelectorAll('.menu-btn.disabled, .mode-card.disabled, .lang-btn.disabled');
    disabledButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            btn.style.animation = 'shake 0.5s';
            setTimeout(() => btn.style.animation = '', 500);
        });
    });
});

// Add shake animation style dynamically if not present
const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-5px); }
    100% { transform: translateX(0); }
}
`;
document.head.appendChild(styleSheet);
