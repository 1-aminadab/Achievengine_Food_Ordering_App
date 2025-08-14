import { Theme } from '../../presentation/theme/theme';
import { IFood } from '../../presentation/types';

export const dummyFoods: IFood[] = [
    {
      id: '1',
      name: 'Spicy Chicken Burger',
      price: 8.99,
      description: 'A juicy chicken burger with a spicy kick, topped with fresh lettuce and tangy sauce.',
      availability: true,
      deliveryTime: '25-30 mins',
      imageUrl: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      quantity: 50,
    },
    {
      id: '2',
      name: 'Vegan Salad Bowl',
      price: 12.49,
      description: 'A healthy mix of fresh greens, quinoa, and a tangy lemon dressing.',
      availability: true,
      deliveryTime: '15-20 mins',
      imageUrl: 'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      quantity: 30,
    },
    {
      id: '3',
      name: 'Chocolate Lava Cake',
      price: 6.99,
      description: 'A warm chocolate cake with a gooey molten center, served with vanilla ice cream.',
      availability: false,
      deliveryTime: 'Unavailable',
      imageUrl: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      quantity: 0,
    },
  ];

 export const foodStoresData = [
    { image: 'https://media.istockphoto.com/id/1348318884/photo/plate-of-mexican-food-tacos.jpg?s=612x612&w=0&k=20&c=Vt8vi4-sCaum6YrzAiAkH7lUJK5mtp2zYT3uYw1M7iA=', text: 'Restaurant', tag:{title:'New', color:Theme.colors.Primary} },
    { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRr1s6IHX1AAIzaPSbAqwApeW7Lngn2qD8xg&s', text: 'Snomart' },
    { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYIcMpcc-GAnYwcxmrPwmoRJNMuDFt6av_Sw&s', text: 'Grocery' },

    { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxDv5PE7uRMIwGaRNXIJxg7d9MtsyW_8hv0Q&s', text: 'Gifting', tag: {title:'Popular'

 , color:'#90EE90'} },
    { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxDv5PE7uRMIwGaRNXIJxg7d9MtsyW_8hv0Q&s', text: 'Pharmacy', tag: {title:'Popular'
 , color:'#90EE90'}},
    { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYIcMpcc-GAnYwcxmrPwmoRJNMuDFt6av_Sw&s', text: 'Health & Beauty' },
    { image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxDv5PE7uRMIwGaRNXIJxg7d9MtsyW_8hv0Q&s', text: 'Gifting', tag: {title:'Popular'   , color:'#90EE90'}},

  ];

  export const homeSwiperData = [
    {
      id:'1',
      label:'Lunch',
      image:'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id:'2',
      label:'Desert',
      image:'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id:'3',
      label:'Dinner',
      image:'https://images.pexels.com/photos/940302/pexels-photo-940302.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id:'4',
      label:'Breakfast',
      image:'https://images.pexels.com/photos/2113556/pexels-photo-2113556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
  ];

  export const cosmeticsData = [
    {
      id:'1',
      label:'Cosmo',
      image:'https://images.ctfassets.net/wlke2cbybljx/4g0ql8rkgh2X3PUiGIb6g9/e9137b9c80b9886f89100c931e2cf39d/PT_EX_NEW_RANGE_SEPHORA_PRODUCTS_NO_EXLUSIVE_resized_4x3.jpg',
    },
    {
      id:'2',
      label:'',
      image:'https://5.imimg.com/data5/SELLER/Default/2023/4/300380630/JX/MC/AX/28344916/cosmetic-private-labeling-manufacturing-1000x1000.png',
    },
    {
      id:'3',
      label:'',
      image:'https://images.pexels.com/photos/940302/pexels-photo-940302.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
      id:'4',
      label:'',
      image:'https://img.freepik.com/free-photo/monochrome-beauty-product-skincare_23-2151307219.jpg?semt=ais_hybrid',
    },
  ];

  export const dummyFooter: { id: string, name: string, imageUrl: string, }[] = [
    {
      id: '1',
      name: 'Chicken Corn Soup',
      imageUrl: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/soup-1238248_1280.jpg',
    },
    {
      id: '2',
      name: 'Hyderabadi Biryani',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/23/10/33/biryani-4298554_1280.jpg',
    },
    {
      id: '3',
      name: 'Mutton Reshmi Kebab',
      imageUrl: 'https://cdn.pixabay.com/photo/2016/03/05/20/07/kebab-1238612_1280.jpg',
    },
  ];