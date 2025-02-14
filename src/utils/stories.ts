export interface Story {
  id: string;
  title: string;
  content: string;
  audioFile: string;
  ageGroup: '0-3' | '3-6';
  gender: 'boy' | 'girl';
  thumbnail: string;
}

export const stories: Story[] = [
  {
    id: '1',
    title: 'Minik Astronot Ali',
    content: 'Minik Ali\'nin en sevdiği şey yıldızlara bakmaktı. Her gece penceresinden gökyüzünü izler, parlayan yıldızları sayardı. \n\nBir gece, odasındaki oyuncak roket canlandı ve Ali\'yi uzaya götürdü. Ay\'da zıpladılar, yıldızlarla dans ettiler. \n\nAli uzayda yeni arkadaşlar edindi: Parlak bir yıldız ve sevimli bir meteor. Hep birlikte uzayda saklambaç oynadılar.\n\nSabah olduğunda Ali yatağında uyuyordu, ama yanında küçük bir yıldız parıldıyordu. Bu, dün geceki macerasının gerçek olduğunun bir işaretiydi.\n\nO günden sonra Ali her gece yeni uzay arkadaşlarıyla buluşmak için sabırsızlanır oldu.',
    audioFile: 'samples/sample_boy_0_3.mp3',
    ageGroup: '0-3',
    gender: 'boy',
    thumbnail: 'samples/sample_boy_0_3.png'
  },
  {
    id: '2',
    title: 'Prenses Ela\'nın Sihirli Bahçesi',
    content: 'Küçük Ela\'nın pembe bir bahçesi vardı. Bu bahçede konuşan çiçekler, dans eden kelebekler yaşardı. \n\nBir gün bahçedeki en küçük çiçek hasta oldu. Yaprakları solmuş, rengi solgunlaşmıştı.\n\nEla ve arkadaşları - neşeli bir papatya, renkli bir kelebek ve bilge bir ağaç - hemen yardıma koştular.\n\nHep birlikte sihirli yağmur damlalarını topladılar. Her damla gökkuşağının bir rengindeydi. Bu damlaları küçük çiçeğe verdiler.\n\nO günden sonra bahçedeki tüm çiçekler daha da güzel açtı. Ela\'nın bahçesi, şehirdeki en renkli ve en mutlu bahçe oldu.',
    audioFile: 'samples/sample_girl_0_3.mp3',
    ageGroup: '0-3',
    gender: 'girl',
    thumbnail: 'samples/sample_girl_0_3.png'
  },
  {
    id: '3',
    title: 'Kaşif Kerem\'in Orman Macerası',
    content: 'Kerem, büyük bir kaşifti. Bir gün sihirli haritasıyla ormana gitti. \n\nOrmanda konuşan hayvanlarla tanıştı: Bilge baykuş, neşeli sincap ve cesur tavşan.\n\nYolda yaralı bir kuşa rastladılar. Kerem ve yeni arkadaşları kuşa yardım ettiler. Sonra kaybolmuş yavru tavşanı bulmak için ipuçlarını takip ettiler.\n\nOrmanın derinliklerinde, yavru tavşanı bir ağaç kovuğunda buldular ve ailesine kavuşturdular.\n\nAkşam olduğunda, tüm orman hayvanları Kerem\'e teşekkür etti ve onu en iyi arkadaşları ilan ettiler. Artık Kerem\'in ormanda birçok arkadaşı vardı.',
    audioFile: 'samples/sample_boy_3_6.mp3',
    ageGroup: '3-6',
    gender: 'boy',
    thumbnail: 'samples/sample_boy_3_6.png'
  },
  {
    id: '4',
    title: 'Zeynep\'in Gökkuşağı Okulu',
    content: 'Zeynep\'in gittiği okul dışarıdan sıradan görünüyordu, ama içi sihir doluydu. \n\nHer sınıf gökkuşağının bir rengindeydi: Kırmızı sınıfta müzik öğreniyor, mavi sınıfta resim yapıyor, mor sınıfta dans ediyorlardı.\n\nSarı sınıfta güneş gibi parlayan kitaplar vardı. Yeşil sınıfta sihirli bitkiler yetiştiriyorlardı.\n\nTuruncu sınıfta en sevdiği şey, renkli balonlarla uçmayı öğrenmekti. Pembe sınıfta ise hayalleri gerçek oluyordu.\n\nZeynep, her gün okuluna gitmek için sabırsızlanıyordu. Çünkü biliyordu ki orada onu yeni maceralar ve arkadaşları bekliyordu.',
    audioFile: 'samples/sample_girl_3_6.mp3',
    ageGroup: '3-6',
    gender: 'girl',
    thumbnail: 'samples/sample_girl_3_6.png'
  }
];
