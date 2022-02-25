//Side nav
function openNav() 
{
    document.getElementById("mySidenav").style.width = "80%";
    document.getElementById("GMlside").style.position="fixed"; 
    document.getElementById("closeButton").style.position="absolute"; 
}

function closeNav() 
{
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("GMlside").style.position="absolute"; 
    document.getElementById("closeButton").style.position="absolute"; 
}

function myFunction() 
{
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") 
    {
        x.className += " responsive";
    } 
    else 
    {
        x.className = "topnav";
    }
}


// Get the modal
var modal = document.getElementById('id01');
var modal = document.getElementById('id02');
var modal = document.getElementById('id03');
var modal = document.getElementById('id04');
var modal = document.getElementById('id05');
var modal = document.getElementById('id23');
var modal = document.getElementById('id35');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) 
{
    if (event.target == modal) 
    {
        modal.style.display = "none";
    }
}

var src = document.getElementById("template01").innerHTML;
var template = Handlebars.compile(src);
var rendered = template({bloodborne01:"There’s incredible power to Bloodborne. It’s not just an amazing dance of dodges and swipes through encounters that often push the limits of reflexes and endurance, it’s a thought-provoking experience that’s wormed its way into my mind and melted my resolve. But through perseverance, patient growth, and determined skill, it’s proved itself an unconventional adventure that ultimately gives much more than it takes – which at times can be a staggering cost. By the end, the only frustrations that don’t turn to triumphs are the technical ones. After more than 60 hours of grappling with its terrors, monsters, and the environment itself, I’m left dumbfounded by Bloodborne’s capability to draw powerful emotions from me, and make me earn the successes that I’ll remember for years to come."});
document.getElementById("target01").innerHTML = rendered;

var src = document.getElementById("template02").innerHTML;
var template = Handlebars.compile(src);
var rendered = template({bloodborne02:"Its unconventional approach to action-RPG gameplay walks a fine line between utter elation and despair as it takes us on an awe-inspiring journey through the highest peaks of satisfaction and the deepest, blackest pits of exhausted desperation. Developer From Software chooses to tell us little about how to survive its gauntlet, and yet expects feats of intelligence and perseverance in the face of its brutal, unrelenting difficulty. That balance is slightly upset by painfully long loading screens upon death or travel to different zones, but the highs of taking down one of the many intimidating bosses make up for those chunks of downtime.Bloodborne’s semi-open world structure and hard-earned progression draw heavily from the Dark Souls and Demon's Souls games that made From famous, though the aggressive new pace of combat is all on its own. These diving, rolling melee battles with an awesome arsenal of transforming melee weapons and tactical sidearms chiseled away my calluses and made me form new ones, even as a hardened Dark Souls veteran. Switching weapons between their light and heavy modes on the fly to string together combo-like attack chains in an engaging way injects a newfound versatility, even if it’s a less calculating kind of battle than we see in From’s earlier games."});
document.getElementById("target02").innerHTML = rendered;

var src = document.getElementById("template03").innerHTML;
var template = Handlebars.compile(src);
var rendered = template({bloodborne03:"That doesn’t make it any easier, though. Being overwhelmed by enemies is commonplace, but thanks to your ability to leech back lost health with quick counterattacks and to stun opponents with secondary weapons, I found it’s possible to sustain a constant onslaught when I’d built up enough skill."});
document.getElementById("target03").innerHTML = rendered;


var src = document.getElementById("template04").innerHTML;
var template = Handlebars.compile(src);
var rendered = template({mario01:"I literally applauded as the end credits rolled on Super Mario Odyssey. I’d spent the last 15 hours with a giant grin on my face, and somehow the climax put the perfect surprising and delightful exclamation point on the plumber’s latest adventure. This is another brilliant redefinition of the very platforming genre he helped popularize 30 years ago.And best of all, even with the story complete, Odyssey has so much more fun to offer.Odyssey looks like a straight successor to the Mario 64 and Sunshine line of sandbox 3D Marios, but it is much more than that. Naturally, it evokes, honors, and is sometimes directly inspired by the games that came before it in its characters, music, and mechanics. But it also has new things to say as well, like fusing classic-style 2D gameplay with the 3D world and using a completely new possession mechanic to add constant variety to Mario’s abilities and exploits.Many of the cleverest and most smile-inducing possessions are best left to be discovered for yourself, but whether it was thrashing about as a huge, realistic-looking T-rex in the prehistoric-themed Cascade Kingdom or becoming a lowly Goomba but then making a stack of Goombas 10-tall to win over a hard-to-impress Lady Goomba, Odyssey mixes up the gameplay in surprising ways in each of its 16-plus worlds. Throughout the entire campaign, you’re using new creatures in new, game-changing ways on a regular basis.Instead, its challenge lies in exploration. There are hundreds and hundreds of Power Moon collectibles to discover, and you’ll want to gather them because they are the keys that unlock new worlds – including the aforementioned post-credits locales! Many Moons are quite difficult to track down, and even once you’ve located them, it’s enjoyably challenging to try and suss out how to get your white-gloved mitts on them. Some are behind classic invisible walls, others are tucked away in linear areas that try to fool you into thinking there’s only one Moon inside of. Each is a fun mini-puzzle to solve – particularly the ones that newly dot the landscape after the story mode ends. I did my best to search thoroughly on my first pass through the campaign, but only ended up with a little more than 200, or less than a quarter of the total complement of collectible celestials.While Odyssey does a great job of thinking outside of the 3D platformer box, it doesn’t invent a way to slay all of the genre’s demons. The camera, for instance still causes trouble sometimes, leading you to whiff on a jump or get the wrong angle to see a boss attack coming.On a logistical note: despite the fact that Nintendo recommends playing with separated Joy-Con controllers when you first start Odyssey up, you can play with whatever you like and not miss a beat in the gameplay. In fact, I felt much more comfortable with the fantastic Pro Controller, which lets you do most of the same motion-based gestures by waving the gamepad. It also supplies all of the same HD Rumble feedback the Joy-Con do.Mario’s games have been around for almost as long as game consoles have been a thing, but thankfully, he’s always evolving. We rarely get the same Mario twice. Super Mario Odyssey delivers on that ongoing promise of originality and innovation: It distills the venerable series’ joyful, irreverent world and characters and best-in-class platforming action, and introduces a steady stream of new and unexpected mechanics. It’s all spun together into a generational masterpiece."});
document.getElementById("target04").innerHTML = rendered;
                            