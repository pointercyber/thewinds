import ext from './assets/ext.jpg'
import bed1 from './assets/bed1.jpg'
import bed2 from './assets/bed2.jpg'
import hill from './assets/hill.jpg'
import bath from './assets/bath.jpg'
import liv1 from './assets/liv1.jpg'
import liv2 from './assets/liv2.jpg'
import kit from './assets/kit.jpg'
export {default as logo} from './assets/logo.png'
export const IMG={ext,bed1,bed2,hill,bath,liv1,liv2,kit}
export const PHONE='+91 99908 15181'
export const wa=(room)=>'https://wa.me/919990815181?text='+encodeURIComponent(room?`Hi The Winds Homestay, I’d like to book the ${room}. Check-in: , Check-out: , Guests: `:'Hi The Winds Homestay, I’d like to check availability.')
export const ROOMS=[
{name:'Deluxe Mountain Mist Room',price:4500,guests:'Up to 3 guests',bed:'1 king bed, rollaway on request',img:'bed2',text:'A private wooden sit-out facing misty tea valleys, cedar-inspired interiors and crisp white bedding.',am:['High-speed Wi-Fi','24/7 hot water','Valley and mountain views','Attached bathroom and toiletries','Smart flat-screen TV','Free secure parking']},
{name:'Grand Valley Family Suite',price:6500,guests:'Up to 5 guests',bed:'2 queen beds and a living lounge',img:'liv1',text:'Space for families and small groups, with panoramic windows, tea garden views and Kerala breakfast.',am:['High-speed Wi-Fi','24/7 hot water','Panoramic tea views','Attached deluxe bathroom','Smart TV and lounge','Free secure parking']},
{name:'Heritage Plantation Cottage',price:5200,guests:'2 adults and 1 child',bed:'1 king bed, garden verandah',img:'ext',text:'Stone-and-timber architecture among cardamom groves and silver oaks, made for private, nature-focused stays.',am:['High-speed Wi-Fi','24/7 hot water','Private garden sit-out','Attached en-suite bathroom','Coffee and tea brewer','Free secure parking']}]
export const GALLERY=[
{k:'ext',t:'Exterior',cat:'The home'},{k:'hill',t:'Tea hills from the roof',cat:'Green views'},{k:'bed2',t:'Bedroom',cat:'Interiors'},{k:'bed1',t:'Bedroom doorway',cat:'Interiors'},
{k:'liv1',t:'Living and dining',cat:'Interiors'},{k:'liv2',t:'Living area and study',cat:'Interiors'},{k:'kit',t:'Kitchen',cat:'Interiors'},{k:'bath',t:'Bathroom',cat:'Interiors'}]
export const CATS=['All photos','The home','Interiors','Green views']
export const WHY=[
['Cozy and airy rooms','Handcrafted wooden furnishings, warm lighting, orthopedic mattresses and private valley sit-outs.'],
['Clean and comfortable','Daily housekeeping, fresh linen, clean bathrooms and hot showers through the day.'],
['Scenic surroundings','Tea plantations, misty valleys and the Western Ghats outside your window.'],
['Warm, caring hosts','Local travel guidance, bonfire arrangements and help planning nearby activities.'],
['Easy access','A base for the 900 Kandi Glass Bridge, Chembra trekking area and Soochipara Waterfalls.'],
['Value for money','Wi-Fi, spacious rooms and homemade breakfast at clear prices.']]
export const EXP=[
['Off-road mountain jeep safari','4x4 trails, stream stops and sunset viewpoints, with drivers arranged by your host.','3–4 hours, from the homestay'],
['Wayanad 900 Kandi glass bridge','A glass skywalk over the forest, plus zip-lining and giant swings.','8.5 km, 18 min drive, half day'],
['Aromatics and tea estate walks','Walk among tea, cardamom and pepper, with birdwatching and tea-making stories.','1–2 hours, around the homestay'],
['Soochipara and Meenmutty waterfalls','Forest trails, freshwater pools and viewpoints in the Western Ghats.','14 km, 25 min drive, 3–5 hours']]
export const SEASONS=[['Winter mist','October to February, 16–25°C','Trekking and sightseeing among misty hills. Carry a light fleece or shawl.'],['Verdant monsoon','June to September','Lush landscapes and waterfalls. Bring waterproofs and grippy shoes.'],['Pleasant summer','March to May','Green hills and outdoor days. October to May is best for cool breezes.']]
export const FAQ=[
['Check-in and check-out','Check-in from 1:00 PM, check-out by 11:00 AM. Early or late arrivals are possible with notice.'],
['Is food available?','Home-cooked Kerala food and homemade breakfast. Please confirm meals with the host.'],
['Is parking available?','Free secure parking is listed with every room.'],
['How do I book?','Message us on WhatsApp or call +91 99908 15181 with your dates, number of guests and preferred room.'],
['Cancellation policy','Please ask the host about cancellations, date changes and any charges before booking.']]
