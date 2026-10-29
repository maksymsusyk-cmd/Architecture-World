const u = (id, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`
const av = n => `https://i.pravatar.cc/120?img=${n}`

export const photos = {
  hero: u('1600585154340-be6161a56a0c', 1000),
  dubai: u('1512453979798-5ea266f8880c'), tower: u('1486406146926-c627a92ad1ab'),
  stripes: u('1545324418-cc1a3fa10c00'), office: u('1497366216548-37526070297c'),
  london: u('1513635269975-59663e0ac1ad'), ny: u('1496442226666-8d4d0e62e6e9'),
  shanghai: u('1474181487882-5abf3f0ba6c2'), bangkok: u('1508009603885-50cf7c579365'),
  singapore: u('1525625293386-3f8f99389edd'), barcelona: u('1583422409516-2895a77efded'),
  night: u('1518005020951-eccb494ad742'), sky: u('1477959858617-67f85cf4f1df'),
  zaha: u('1565008576549-57569a49371d', 1400)
}
export const defaultNewsImages = [photos.dubai, photos.tower, photos.stripes, photos.office, photos.sky]
export const coverChoices = [photos.zaha, photos.sky, photos.night, photos.london, photos.singapore, photos.barcelona]
export const buildingStyles = ['Сучасна архітектура', 'Хай-тек', 'Модерн', 'Неофутуризм', 'Деконструктивізм', 'Бруталізм', 'Мінімалізм', 'Готика', 'Класицизм']
export const ratingIcons = ['🏆', '🌿', '🏠', '🏢', '🎓', '🏛️', '🌉', '⭐']
export const avatarChoices = [3, 12, 15, 32, 47, 59].map(av)

export const seedUsers = [{
  id: 'u-demo', name: 'Андрій Коваленко', handle: '@andrii_kovalenko', email: 'demo@architecture.world', password: '123456',
  avatar: av(12), bio: 'Студент архітектурного факультету. Цікавлюсь сучасною архітектурою, дизайном та урбаністикою.',
  city: 'Львів, Україна', joined: new Date('2025-03-03').getTime(), saved: [], cover: ''
}]

const pool = [photos.dubai, photos.night, photos.tower, photos.sky, photos.office, photos.stripes, photos.london, photos.ny]
const B = (id, name, place, architect, year, style, rating, votes, img, coords, subtitle) => ({
  id, name, place, architect, year, style, rating, votes, img, coords, subtitle,
  description: [`${name} — відомий архітектурний об’єкт (${place}). Проєкт створив ${architect}, а будівництво завершилося у ${year} році.`,
    `Споруда належить до напряму «${style}» і щороку приваблює туристів та архітекторів з усього світу.`],
  features: [`Рік завершення — ${year}`, `Автор проєкту — ${architect}`, `Стиль — ${style}`],
  tags: [style, place.split(',')[0]], gallery: [img, ...pool.filter(p => p !== img).slice(0, 7)]
})
const seedBuildings = [
  { ...B('burj-khalifa', 'Burj Khalifa', 'Дубай, ОАЕ', 'Adrian Smith', 2010, 'Сучасна архітектура', 4.8, 341, photos.dubai, [25.1972, 55.2744], 'Найвища будівля у світі, символ сучасного Дубая'),
    gallery: pool, tags: ['Хмарочос', 'Сучасна архітектура', 'Дубай', 'Найвища будівля світу'],
    features: ['Висота — 828 м, 163 поверхи', 'Ліфти зі швидкістю до 10 м/с', 'Понад 24 000 вікон з енергоефективним склінням', 'Y-подібний план у формі квітки гіменокалісу'],
    description: ['Burj Khalifa — це надвисотний хмарочос, розташований у центрі Дубая. Його висота становить 828 метрів, що робить його найвищою будівлею у світі. Будівля була спроєктована архітектурним бюро Skidmore, Owings & Merrill під керівництвом Адріана Сміта. Будівництво тривало з 2004 по 2010 рік.',
      'Burj Khalifa поєднує в собі сучасні інженерні технології, унікальний дизайн та символізує прагнення людства до нових висот. У будівлі розташовані житлові апартаменти, офіси, готель, ресторани та оглядові майданчики.'] },
  B('the-shard', 'The Shard', 'Лондон, Велика Британія', 'Renzo Piano', 2012, 'Сучасна архітектура', 4.8, 287, photos.london, [51.5045, -0.0865], 'Скляна піраміда над Темзою'),
  B('marina-bay-sands', 'Marina Bay Sands', 'Сінгапур', 'Moshe Safdie', 2010, 'Хай-тек', 4.7, 254, photos.singapore, [1.2834, 103.8607], 'Готель із басейном на даху'),
  B('sagrada-familia', 'Sagrada Familia', 'Барселона, Іспанія', 'Antoni Gaudí', 1882, 'Модерн', 4.6, 512, photos.barcelona, [41.4036, 2.1744], 'Незавершений шедевр Гауді'),
  B('one-wtc', 'One World Trade Center', 'Нью-Йорк, США', 'David Childs', 2014, 'Неофутуризм', 4.5, 198, photos.ny, [40.7127, -74.0134], 'Найвищий хмарочос Західної півкулі'),
  B('shanghai-tower', 'Shanghai Tower', 'Шанхай, Китай', 'Gensler', 2015, 'Сучасна архітектура', 4.4, 176, photos.shanghai, [31.2335, 121.5055], 'Спіральний гігант Шанхая'),
  B('mahanakhon', 'MahaNakhon', 'Бангкок, Таїланд', 'Ole Scheeren', 2016, 'Деконструктивізм', 4.3, 143, photos.bangkok, [13.7233, 100.5284], 'Піксельна вежа Бангкока')
]
export const seedReviews = {
  'burj-khalifa': [
    { id: 'rv1', author: 'Олена К.', avatar: av(47), time: '12 квітня 2025', rating: 5, text: 'Неймовірна споруда! Вражає своїми масштабами та архітектурним рішенням. Обов’язково варто відвідати!', likes: 52, comments: 3 },
    { id: 'rv2', author: 'Максим С.', avatar: av(33), time: '5 березня 2025', rating: 5, text: 'Дуже гарна будівля, особливо ввечері. Вид на місто просто неймовірний. Єдине, що ціни на квитки досить високі.', likes: 34, comments: 7 },
    { id: 'rv3', author: 'Катерина Л.', avatar: av(5), time: '20 лютого 2025', rating: 5, text: 'Це один із тих об’єктів, які потрібно побачити хоча б раз у житті. Вражає інженерна думка та масштаб проєкту.', likes: 41, comments: 5 }]
}

export const seedNews = [
  { id: 'n1', dateLabel: '12 квітня 2025', cat: 'Культура', title: 'У Києві відкрили новий культурний центр', text: 'Сучасний простір поєднує мистецтво, архітектуру та інновації.', img: photos.dubai },
  { id: 'n2', dateLabel: '10 квітня 2025', cat: 'Конкурси', title: 'Найкращі архітектурні проєкти 2025 року', text: 'Оголошено переможців міжнародного конкурсу з архітектури.', img: photos.tower },
  { id: 'n3', dateLabel: '8 квітня 2025', cat: 'Сталий розвиток', title: 'В Японії побудували будівлю з дерева', text: 'Унікальна споруда стала символом сталого будівництва.', img: photos.stripes },
  { id: 'n4', dateLabel: '5 квітня 2025', cat: 'Технології', title: 'Нові технології в архітектурі', text: 'Як штучний інтелект змінює проєктування будівель.', img: photos.office }
].map(n => ({ ...n, body: `${n.text} Автори проєкту кажуть, що головна мета — створити простір, який буде корисним для міста та його мешканців. Докладніші матеріали та інтерв’ю з архітекторами ми опублікуємо найближчим часом.` }))
export const newsCategories = ['Культура', 'Конкурси', 'Сталий розвиток', 'Технології', 'Інше']

const seedRatings = [
  ['🏆', 'ТОП 10 сучасних будівель', 'Найвпізнаваніші споруди XXI століття', ['burj-khalifa', 'the-shard', 'marina-bay-sands', 'one-wtc', 'shanghai-tower', 'mahanakhon']],
  ['🌿', 'ТОП екологічних будівель', 'Проєкти, що думають про довкілля', ['marina-bay-sands', 'shanghai-tower']],
  ['🏛️', 'ТОП історичних шедеврів', 'Архітектура, що пережила століття', ['sagrada-familia']],
  ['🏢', 'ТОП офісних будівель', 'Хмарочоси та бізнес-центри', ['the-shard', 'one-wtc', 'shanghai-tower']]]

export const categories = [
  { icon: '🎓', name: 'Допомога студентам', sub: 'Питання, поради, навчання', n: 124 },
  { icon: '📐', name: 'Проєктування', sub: 'Креслення, планування, BIM', n: 98 },
  { icon: '🏗️', name: 'Будівництво', sub: 'Технології, матеріали, процеси', n: 76 },
  { icon: '💻', name: 'Архітектурні програми', sub: 'AutoCAD, Revit, SketchUp та ін.', n: 65 },
  { icon: '🎨', name: 'Дизайн', sub: 'Інтер’єри, екстер’єри, візуалізація', n: 48 },
  { icon: '📚', name: 'Навчання', sub: 'Курси, університети, іспити', n: 42 },
  { icon: '💼', name: 'Кар’єра', sub: 'Робота, стажування, проекти', n: 37 }]
export const catStyles = [['bg-blue-100', 'text-blue-600 bg-blue-50'], ['bg-purple-100', 'text-purple-600 bg-purple-50'], ['bg-slate-100', 'text-slate-600 bg-slate-100'], ['bg-rose-100', 'text-rose-600 bg-rose-50'], ['bg-amber-100', 'text-amber-700 bg-amber-50']]
export const catStyleIndex = { 'Допомога студентам': 0, 'Архітектурні програми': 1, 'Кар’єра': 2, 'Дизайн': 3, 'Проєктування': 4, 'Будівництво': 2, 'Навчання': 0 }

const rawTopics = [
  { title: 'Як правильно зробити план першого поверху?', cat: 'Допомога студентам', text: 'Доброго дня! Підкажіть, будь ласка, як правильно розмістити приміщення на першому поверсі житлового будинку? Які є основні вимоги?', replies: 12, views: 342, author: 'Максим С.', time: '2 год тому', img: av(15), avatar: av(33) },
  { title: 'Порада по програмі для 3D-моделювання', cat: 'Архітектурні програми', text: 'Яку програму краще обрати для початківця? Потрібна для навчання та невеликих проєктів.', replies: 18, views: 521, author: 'Ірина П.', time: '5 год тому', img: av(11), avatar: av(26) },
  { title: 'Досвід роботи в архітектурному бюро', cat: 'Кар’єра', text: 'Хочу дізнатись, як проходить співбесіда в архітектурне бюро і на що звертають увагу.', replies: 24, views: 768, author: 'Андрій К.', authorId: 'u-demo', time: '8 год тому', img: av(52), avatar: av(12) },
  { title: 'Які книги варто прочитати початківцю?', cat: 'Навчання', text: 'Порадьте, будь ласка, книги з архітектури для початківців. Можливо, є список обов’язкової літератури?', replies: 16, views: 430, author: 'Катерина Л.', time: '12 год тому', img: av(45), avatar: av(5) },
  { title: 'Відкриті вакансії для архітекторів', cat: 'Кар’єра', text: 'Де зараз можна знайти роботу для молодого спеціаліста? Поділіться, будь ласка, посиланнями.', replies: 9, views: 287, author: 'Дмитро В.', time: '1 день тому', img: av(60), avatar: av(68) },
  { title: 'Сучасні тенденції в архітектурі 2025', cat: 'Дизайн', text: 'Які зараз актуальні стилі та тенденції в архітектурі? Поділіться своїми думками та прикладами.', replies: 14, views: 412, author: 'Олена К.', time: '1 день тому', img: av(47), avatar: av(49) }]
const seedReplyTexts = ['Гарне питання! Я б радив почати з базових принципів і переглянути приклади реальних проєктів.', 'Підтримую. Також корисно обговорити це з викладачами чи колегами — мені такий підхід допоміг.']
export const seedTopics = rawTopics.map((t, i) => ({
  id: `t${i + 1}`, ...t, baseReplies: t.replies - 2,
  replies: [{ id: `r${i}a`, author: 'Ірина П.', avatar: av(26), text: seedReplyTexts[0], time: '1 год тому' },
    { id: `r${i}b`, author: 'Максим С.', avatar: av(33), text: seedReplyTexts[1], time: '30 хв тому' }]
}))
// Демонстраційні дані: створюються з актуальними часовими мітками
export const makeSeed = () => {
  const now = Date.now(), H = 36e5, hrs = [2, 5, 8, 12, 24, 26]
  return {
    buildings: seedBuildings.map((b, i) => ({ ...b, createdAt: now - (i + 1) * H })),
    news: seedNews.map(({ dateLabel, ...n }, i) => ({ ...n, createdAt: now - (i + 1) * 48 * H })),
    ratings: seedRatings.map(([icon, title, desc, buildingIds], i) => ({ id: `rt${i + 1}`, icon, title, desc, buildingIds, createdAt: now - i * H })),
    topics: seedTopics.map((t, i) => { const c = now - hrs[i] * H; return { ...t, createdAt: c, replies: t.replies.map((r, j) => ({ ...r, createdAt: c + (j + 1) * 600000 })) } }),
    reviews: seedReviews
  }
}
