import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select'; 
import { FaBars, FaTimes, FaHome, FaCloudSun, FaInfoCircle, FaEnvelope, FaMapMarkedAlt, FaToggleOn, FaMoon } from 'react-icons/fa';
import './App.css';
import Mapbox from './Mapbox.js';
import { FaSuitcaseMedical } from 'react-icons/fa6';

function App() {
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const modalRef = useRef(null);
  const navRef = useRef(null);

  function setDayNightBackground() {
    const hour = new Date().getHours();
    const body = document.body;
    body.classList.toggle('day', hour >= 6 && hour < 18);
    body.classList.toggle('night', hour < 6 || hour >= 18);
  }
  const locations = {
    "Andhra Pradesh": {
      "Anantapur": ["Anantapur", "Hindupur", "Dharmavaram", "Kadiri", "Puttaparthi", "Penukonda", "Guntakal"],
      "Chittoor": ["Chittoor", "Tirupati", "Madanapalle", "Puttur", "Kuppam", "Chandragiri", "Nagari"],
      "East Godavari": ["Kakinada", "Rajahmundry", "Amalapuram", "Peddaganjam", "Tuni", "Samalkot", "Jaggampeta"],
      "Guntur": ["Guntur", "Vijayawada", "Narasaraopet", "Tenali", "Bapatla", "Gurazala", "Chilakaluripet"],
      "Krishna": ["Vijayawada", "Machilipatnam", "Gudivada", "Nuzvid", "Penamaluru", "Mylavaram", "Krishna"],
      "Kurnool": ["Kurnool", "Nandyal", "Adoni", "Dhone", "Yemmiganur", "Allagadda", "Peddapalli"],
      "Nellore": ["Nellore", "Kavali", "Gudur", "Naidupet", "Udayagiri", "Atmakur", "Sullurpeta"],
      "Prakasam": ["Ongole", "Chirala", "Markapur", "Kandukur", "Giddalur", "Yerragondapalem", "Peddaganjam"],
      "Srikakulam": ["Srikakulam", "Vizianagaram", "Tekkali", "Palakonda", "Rajam", "Narasannapeta", "Hiramandalam"],
      "Visakhapatnam": ["Visakhapatnam", "Anakapalli", "Narsipatnam", "Tuni", "Paderu", "Bheemunipatnam", "Yelamanchili"],
      "Vizianagaram": ["Vizianagaram", "Parvathipuram", "Bobbili", "Salur", "Nellimarla", "Dattirajeru", "Kurupam"],
      "West Godavari": ["Eluru", "Bhimavaram", "Narasapur", "Jangareddygudem", "Palacole", "Tadepalligudem", "Kalla"],
      "YSR Kadapa": ["Kadapa", "Proddatur", "Rajampet", "Jammalamadugu", "Pulivendula", "Mydukur", "Kamalapuram"],
    },
    "Arunachal Pradesh": {
      "Itanagar": ["Itanagar", "Naharlagun", "Banderdewa", "Doimukh"],
      "Tawang": ["Tawang", "Lumla", "Jang", "Mago"],
      "Bomdila": ["Bomdila", "Dirang", "Kalaktang"],
      "Ziro": ["Ziro", "Hapoli", "Raga"],
      "Tezu": ["Tezu", "Sunpura", "Lohitpur"],
      "Pasighat": ["Pasighat", "Mebo", "Sille"],
      "Yingkiong": ["Yingkiong", "Mariyang", "Tuting"],
    },
    "Assam": {
      "Guwahati": ["Guwahati", "Dispur", "Barpeta", "Nalbari", "Amingaon"],
      "Silchar": ["Silchar", "Haflong", "Lakhipur"],
      "Dibrugarh": ["Dibrugarh", "Tinsukia", "Naharkatia"],
      "Jorhat": ["Jorhat", "Golaghat", "Mariani"],
      "Nagaon": ["Nagaon", "Raha", "Kaliabor"],
      "Bongaigaon": ["Bongaigaon", "New Bongaigaon", "Abhayapuri"],
      "Tezpur": ["Tezpur", "Rangapara", "Gohpur"],
    },
    "Bihar": {
      "Patna": ["Patna", "Danapur", "Patna City", "Bakhtiyarpur"],
      "Gaya": ["Gaya", "Bodh Gaya", "Sherghati"],
      "Bhagalpur": ["Bhagalpur", "Kahalgaon", "Naugachia"],
      "Muzaffarpur": ["Muzaffarpur", "Sitamarhi", "Sheohar"],
      "Darbhanga": ["Darbhanga", "Madhubani", "Jhanjharpur"],
      "Munger": ["Munger", "Jamalpur", "Lakhisarai"],
      "Nalanda": ["Nalanda", "Rajgir", "Bihar Sharif"],
    },
    "Chhattisgarh": {
      "Raipur": ["Raipur", "Bhilai", "Durg", "Bilaspur", "Korba"],
      "Bilaspur": ["Bilaspur", "Mungeli", "Tilda"],
      "Durg": ["Durg", "Bhilai", "Jamul"],
      "Jagdalpur": ["Jagdalpur", "Bastar", "Kanker"],
      "Korba": ["Korba", "Katghora", "Pali"],
      "Rajnandgaon": ["Rajnandgaon", "Dongargarh", "Khairagarh"],
      "Bhilai": ["Bhilai", "Durg", "Jamul"],
    },
    "Goa": {
      "Panaji": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
      "Margao": ["Margao", "Cortalim", "Bicholim"],
    },
    "Gujarat": {
      "Ahmedabad": ["Ahmedabad", "Gandhinagar", "Anand"],
      "Surat": ["Surat", "Navsari", "Valsad"],
      "Vadodara": ["Vadodara", "Anand", "Chhota Udaipur"],
      "Rajkot": ["Rajkot", "Gondal", "Wankaner"],
      "Gandhinagar": ["Gandhinagar", "Kalol", "Mansa"],
      "Junagadh": ["Junagadh", "Gir Somnath", "Veraval"],
      "Bhavnagar": ["Bhavnagar", "Palitana", "Mahuva"],
    },
    "Haryana": {
      "Chandigarh": ["Chandigarh", "Panchkula", "Mohali"],
      "Faridabad": ["Faridabad", "Ballabgarh", "Sohna"],
      "Gurgaon": ["Gurgaon", "Manesar", "Pataudi"],
      "Ambala": ["Ambala", "Jagadhri", "Yamunanagar"],
      "Hisar": ["Hisar", "Fatehabad", "Sirsa"],
      "Panipat": ["Panipat", "Samalkha", "Khalilpur"],
      "Karnal": ["Karnal", "Nilokheri", "Gharaunda"],
    },
    "Himachal Pradesh": {
      "Shimla": ["Shimla", "Solan", "Mandi"],
      "Manali": ["Manali", "Kullu", "Naggar"],
      "Dharamshala": ["Dharamshala", "Kangra", "Palampur"],
      "Solan": ["Solan", "Kasauli", "Nalagarh"],
      "Mandi": ["Mandi", "Sundernagar", "Padhar"],
      "Kullu": ["Kullu", "Manali", "Bhuntar"],
      "Hamirpur": ["Hamirpur", "Nadaun", "Sujanpur"],
    },
    "Jharkhand": {
      "Ranchi": ["Ranchi", "Khunti", "Lohardaga"],
      "Jamshedpur": ["Jamshedpur", "Ghatshila", "Mango"],
      "Dhanbad": ["Dhanbad", "Bokaro", "Sindri"],
      "Bokaro": ["Bokaro", "Chas", "Bermo"],
      "Hazaribagh": ["Hazaribagh", "Chatra", "Koderma"],
      "Dumka": ["Dumka", "Jamtara", "Deoghar"],
      "Giridih": ["Giridih", "Dumri", "Pirtand"],
    },
    "Karnataka": {
      "Bangalore": ["Bangalore", "Mysore", "Tumkur"],
      "Mysore": ["Mysore", "Nanjangud", "Mandya"],
      "Hubli": ["Hubli", "Dharwad", "Bagalkot"],
      "Dharwad": ["Dharwad", "Hubli", "Gadag"],
      "Mangalore": ["Mangalore", "Udupi", "Kasaragod"],
      "Bellary": ["Bellary", "Hospet", "Sandur"],
      "Gulbarga": ["Gulbarga", "Raichur", "Bidar"],
    },
    "Kerala": {
      "Thiruvananthapuram": ["Thiruvananthapuram", "Kollam", "Nagercoil"],
      "Kochi": ["Kochi", "Ernakulam", "Alappuzha"],
      "Kozhikode": ["Kozhikode", "Malappuram", "Wayanad"],
      "Kottayam": ["Kottayam", "Pala", "Changanassery"],
      "Palakkad": ["Palakkad", "Ottapalam", "Chittur"],
      "Thrissur": ["Thrissur", "Irinjalakuda", "Thriprayar"],
      "Alappuzha": ["Alappuzha", "Cherthala", "Mavelikkara"],
    },
    "Ladakh": {
      "Leh": ["Leh", "Nubra Valley", "Zanskar"],
      "Kargil": ["Kargil", "Drass", "Sankoo"],
    },
    "Lakshadweep": {
      "Kavaratti": ["Kavaratti", "Agatti", "Minicoy"],
    },
    "Madhya Pradesh": {
      "Bhopal": ["Bhopal", "Raisen", "Sehore"],
      "Indore": ["Indore", "Dewas", "Ujjain"],
      "Jabalpur": ["Jabalpur", "Mandla", "Katni"],
      "Gwalior": ["Gwalior", "Morena", "Bhind"],
      "Sagar": ["Sagar", "Damoh", "Khurai"],
      "Rewa": ["Rewa", "Sidhi", "Satna"],
      "Satna": ["Satna", "Maihar", "Amarpatan"],
    },
    "Maharashtra": {
      "Mumbai": ["Mumbai", "Thane", "Navi Mumbai"],
      "Pune": ["Pune", "Pimpri-Chinchwad", "Talegaon"],
      "Nagpur": ["Nagpur", "Wardha", "Chandrapur"],
      "Nashik": ["Nashik", "Malegaon", "Satana"],
      "Aurangabad": ["Aurangabad", "Jalna", "Beed"],
      "Solapur": ["Solapur", "Pandharpur", "Akkalkot"],
      "Kolhapur": ["Kolhapur", "Ichalkaranji", "Karvir"],
    },
    "Manipur": {
      "Imphal": ["Imphal", "Thoubal", "Bishnupur"],
      "Churachandpur": ["Churachandpur", "Tuibong", "Henglep"],
      "Ukhrul": ["Ukhrul", "Jessami", "Kamjong"],
      "Senapati": ["Senapati", "Mao", "Kangpokpi"],
    },
    "Meghalaya": {
      "Shillong": ["Shillong", "Jowai", "Tura"],
      "Tura": ["Tura", "Phulbari", "Williamnagar"],
      "Jowai": ["Jowai", "Mookym", "Nartiang"],
    },
    "Mizoram": {
      "Aizawl": ["Aizawl", "Lunglei", "Champhai"],
      "Lunglei": ["Lunglei", "Siaha", "Kolasib"],
      "Champhai": ["Champhai", "Lawngtlai", "Serchhip"],
    },
    "Nagaland": {
      "Kohima": ["Kohima", "Dimapur", "Mokokchung"],
      "Dimapur": ["Dimapur", "Chumukedima", "Niuland"],
      "Mokokchung": ["Mokokchung", "Longleng", "Mon"],
    },
    "Odisha": {
      "Bhubaneswar": ["Bhubaneswar", "Cuttack", "Khurda"],
      "Cuttack": ["Cuttack", "Baripada", "Dhenkanal"],
      "Sambalpur": ["Sambalpur", "Jharsuguda", "Bargarh"],
      "Rourkela": ["Rourkela", "Sundargarh", "Kuanrmunda"],
      "Berhampur": ["Berhampur", "Ganjam", "Chikiti"],
    },
    "Punjab": {
      "Chandigarh": ["Chandigarh", "Panchkula", "Mohali"],
      "Amritsar": ["Amritsar", "Tarn Taran", "Ajnala"],
      "Ludhiana": ["Ludhiana", "Khanna", "Mandi Gobindgarh"],
      "Jalandhar": ["Jalandhar", "Phagwara", "Kapurthala"],
      "Patiala": ["Patiala", "Rajpura", "Samana"],
      "Mohali": ["Mohali", "Kharar", "Derabassi"],
    },
    "Rajasthan": {
      "Jaipur": ["Jaipur", "Ajmer", "Alwar"],
      "Jodhpur": ["Jodhpur", "Pali", "Osian"],
      "Udaipur": ["Udaipur", "Rajsamand", "Chittorgarh"],
      "Kota": ["Kota", "Baran", "Bundi"],
      "Bikaner": ["Bikaner", "Nagaur", "Jhunjhunu"],
      "Jaisalmer": ["Jaisalmer", "Barmer", "Phalodi"],
      "Alwar": ["Alwar", "Behror", "Rajgarh"],
    },
    "Sikkim": {
      "Gangtok": ["Gangtok", "Namchi", "Mangan"],
      "Namchi": ["Namchi", "Ravangla", "Jorethang"],
      "Mangan": ["Mangan", "Chungthang", "Lachen"],
    },
    "Tamil Nadu": {
    "Ariyalur": ["Ariyalur", "Sendurai", "Udayarpalayam"],
    "Chennai": ["Arakkonam", "Chennai", "Kanchipuram", "Nungambakkam", "Tambaram", "Tiruvallur"],
    "Chengalpattu": ["Chengalpattu", "Maraimalai Nagar", "Pallavaram", "Urapakkam"],
    "Coimbatore": ["Avinashi", "Coimbatore", "Mettupalayam", "Nilgiris", "Pollachi", "Tirupur"],
    "Cuddalore": ["Cuddalore", "Kattumannarkoil", "Nellikuppam", "Panruti"],
    "Dharmapuri": ["Dharmapuri", "Harur", "Palacode", "Pappireddipatti"],
    "Dindigul": ["Dindigul", "Kodaikanal", "Natham", "Vedasandur"],
    "Erode": ["Bhavani", "Erode", "Gobichettipalayam", "Mallipalayam", "Nambiyur","Perundurai", "Siruvalur", "Vellode"],
    "Kallakurichi": ["Kallakurichi", "Chinnasalem", "Kalvarayan Hills"],
    "Kanchipuram": ["Kanchipuram", "Cheyyar", "Sriperumbudur", "Vandavasi"],
    "Kanyakumari": ["Colachel", "Kalkulam", "Kanyakumari", "Nagercoil", "Padmanabhapuram"],
    "Karur": ["Karur", "Aravakurichi", "Kumarapalayam", "Kondattam"],
    "Krishnagiri": ["Krishnagiri", "Hosur", "Pochampalli", "Rayakottai"],
    "Madurai": ["Madurai", "Dindigul", "Sivaganga", "Theni"],
    "Nagapattinam": ["Nagapattinam", "Kumbakonam", "Thiruvarur", "Velankanni"],
    "Namakkal": ["Namakkal", "Rasipuram", "Salem", "Tiruchengode"],
    "Nilgiris": ["Coonoor", "Kothagiri", "Ooty", "Pykara"],
    "Perambalur": ["Perambalur", "Kunnam", "Veppanthattai"],
    "Pudukkottai": ["Pudukkottai", "Alangudi", "Aranthangi", "Karaikudi"],
    "Ramanathapuram": ["Paramakudi", "Rameswaram", "Ramanathapuram", "Sankarankovil"],
    "Ranipet": ["Ranipet", "Arcot", "Vellore", "Walajah"],
    "Salem": ["Attur", "Dharmapuri", "Namakkal", "Salem"],
    "Sivaganga": ["Sivaganga", "Karaikudi", "Ramanathapuram", "Sivaganga"],
    "Tenkasi": ["Tenkasi", "Sankarankovil", "Kadayanallur", "Aruppukottai"],
    "Thanjavur": ["Kumbakonam", "Nagapattinam", "Thanjavur", "Tiruvarur"],
    "Theni": ["Theni", "Bodinayakkanur", "Periyakulam", "Cumbum"],
    "Thoothukudi": ["Thoothukudi", "Tiruchendur", "Kovilpatti", "Ottapidaram"],
    "Tiruchirappalli": ["Tiruchirappalli", "Karur", "Perambalur", "Srirangam"],
    "Tirunelveli": ["Tirunelveli", "Nellai", "Tenkasi", "Cheranmahadevi"],
    "Tirupathur": ["Tirupathur", "Jolarpet", "Vaniyambadi", "Pochampalli"],
    "Tiruppur": ["Tiruppur", "Kangeyam", "Palladam", "Udumalaipettai"],
    "Tiruvallur": ["Tiruvallur", "Arakkonam", "Poonamallee", "Gummidipoondi"],
    "Tiruvannamalai": ["Tiruvannamalai", "Arni", "Chetpet", "Polur"],
    "Tiruvarur": ["Tiruvarur", "Thiruthuraipoondi", "Nannilam", "Needamangalam"],
    "Vellore": ["Arakkonam", "Gudiyattam", "Ranipet", "Vellore"],
    "Viluppuram": ["Viluppuram", "Mangalur", "Thirukoilur", "Ulundurpet"],
    "Virudhunagar": ["Virudhunagar", "Sivakasi", "Srivilliputhur", "Aruppukottai"],
    },

    "Telangana": {
      "Hyderabad": ["Hyderabad", "Secunderabad", "Cyberabad"],
      "Warangal": ["Warangal", "Hanamkonda", "Kazipet"],
      "Nizamabad": ["Nizamabad", "Bodhan", "Kamareddy"],
      "Khammam": ["Khammam", "Palvancha", "Madhira"],
      "Karimnagar": ["Karimnagar", "Jagitial", "Huzurabad"],
    },
    "Tripura": {
      "Agartala": ["Agartala", "Udaipur", "Sabroom"],
      "Dharmanagar": ["Dharmanagar", "Kailashahar", "Kumarghat"],
    },
    "Uttar Pradesh": {
      "Lucknow": ["Lucknow", "Kanpur", "Sitapur"],
      "Kanpur": ["Kanpur", "Unnao", "Farrukhabad"],
      "Varanasi": ["Varanasi", "Jaunpur", "Chandauli"],
      "Agra": ["Agra", "Firozabad", "Etah"],
      "Meerut": ["Meerut", "Muzaffarnagar", "Saharanpur"],
      "Allahabad": ["Allahabad", "Prayagraj", "Kaushambi"],
      "Gorakhpur": ["Gorakhpur", "Deoria", "Basti"],
    },
    "Uttarakhand": {
      "Dehradun": ["Dehradun", "Mussoorie", "Haridwar"],
      "Haridwar": ["Haridwar", "Rishikesh", "Roorkee"],
      "Nainital": ["Nainital", "Haldwani", "Kathgodam"],
      "Almora": ["Almora", "Bageshwar", "Pithoragarh"],
      "Udham Singh Nagar": ["Udham Singh Nagar", "Kashipur", "Rudrapur"],
    },
    "West Bengal": {
      "Kolkata": ["Kolkata", "Howrah", "Salt Lake"],
      "Howrah": ["Howrah", "Uluberia", "Santragachi"],
      "Siliguri": ["Siliguri", "Jalpaiguri", "Cooch Behar"],
      "Durgapur": ["Durgapur", "Asansol", "Bankura"],
      "Kharagpur": ["Kharagpur", "Midnapore", "Jhargram"],
      "Malda": ["Malda", "English Bazar", "Chanchal"],
    }
  

  };

  const coordinates = {
      "Andhra Pradesh": {
        "Anantapur": {
          "Anantapur": { latitude: 14.6811, longitude: 77.6006 },
          "Hindupur": { latitude: 13.8274, longitude: 77.5638 },
          "Dharmavaram": { latitude: 14.4011, longitude: 77.7347 },
          "Kadiri": { latitude: 14.0512, longitude: 77.3434 },
          "Puttaparthi": { latitude: 14.1853, longitude: 77.8055 },
          "Penukonda": { latitude: 14.0571, longitude: 77.6496 },
          "Guntakal": { latitude: 15.1663, longitude: 77.3757 }
        },
        "Chittoor": {
          "Chittoor": { latitude: 13.2166, longitude: 79.1003 },
          "Tirupati": { latitude: 13.6288, longitude: 79.4192 },
          "Madanapalle": { latitude: 13.5656, longitude: 78.8688 },
          "Puttur": { latitude: 13.0841, longitude: 79.6485 },
          "Kuppam": { latitude: 13.5075, longitude: 78.8102 },
          "Chandragiri": { latitude: 13.2266, longitude: 79.3048 },
          "Nagari": { latitude: 13.0915, longitude: 79.4413 }
        },
        "East Godavari": {
          "Kakinada": { latitude: 16.9661, longitude: 82.2400 },
          "Rajahmundry": { latitude: 17.0026, longitude: 81.7700 },
          "Amalapuram": { latitude: 16.5651, longitude: 81.4804 },
          "Peddaganjam": { latitude: 16.7023, longitude: 81.7043 },
          "Tuni": { latitude: 17.3330, longitude: 82.8506 },
          "Samalkot": { latitude: 17.0258, longitude: 82.2460 },
          "Jaggampeta": { latitude: 17.2756, longitude: 82.4016 }
        },
        "Guntur": {
          "Guntur": { latitude: 16.3068, longitude: 80.4365 },
          "Vijayawada": { latitude: 16.5060, longitude: 80.6480 },
          "Narasaraopet": { latitude: 16.2535, longitude: 80.0535 },
          "Tenali": { latitude: 16.2534, longitude: 80.6214 },
          "Bapatla": { latitude: 15.9150, longitude: 80.4636 },
          "Gurazala": { latitude: 16.3346, longitude: 80.1267 },
          "Chilakaluripet": { latitude: 16.1467, longitude: 80.1872 }
        },
        "Krishna": {
          "Vijayawada": { latitude: 16.5060, longitude: 80.6480 },
          "Machilipatnam": { latitude: 16.1840, longitude: 81.1376 },
          "Gudivada": { latitude: 16.4316, longitude: 81.1113 },
          "Nuzvid": { latitude: 16.8261, longitude: 81.5758 },
          "Penamaluru": { latitude: 16.5153, longitude: 80.6446 },
          "Mylavaram": { latitude: 16.7024, longitude: 81.3510 },
          "Krishna": { latitude: 16.4292, longitude: 80.5911 }
        },
        "Kurnool": {
          "Kurnool": { latitude: 15.8281, longitude: 78.0373 },
          "Nandyal": { latitude: 15.4385, longitude: 78.4877 },
          "Adoni": { latitude: 15.6333, longitude: 77.2813 },
          "Dhone": { latitude: 15.3776, longitude: 77.7138 },
          "Yemmiganur": { latitude: 15.4617, longitude: 77.2512 },
          "Allagadda": { latitude: 15.2824, longitude: 78.2640 },
          "Peddapalli": { latitude: 15.4886, longitude: 78.6004 }
        },
        "Nellore": {
          "Nellore": { latitude: 14.4426, longitude: 79.9864 },
          "Kavali": { latitude: 14.9444, longitude: 79.9698 },
          "Gudur": { latitude: 14.0736, longitude: 79.9530 },
          "Naidupet": { latitude: 14.3091, longitude: 79.9503 },
          "Udayagiri": { latitude: 14.2483, longitude: 79.7766 },
          "Atmakur": { latitude: 14.3638, longitude: 79.4257 },
          "Sullurpeta": { latitude: 13.6923, longitude: 79.9136 }
        },
        "Prakasam": {
          "Ongole": { latitude: 15.8291, longitude: 80.0484 },
          "Chirala": { latitude: 15.8252, longitude: 80.3401 },
          "Markapur": { latitude: 15.8614, longitude: 79.2420 },
          "Kandukur": { latitude: 15.4001, longitude: 79.8275 },
          "Giddalur": { latitude: 15.6181, longitude: 79.3110 },
          "Yerragondapalem": { latitude: 15.2153, longitude: 79.7630 },
          "Peddaganjam": { latitude: 16.7023, longitude: 81.7043 }
        },
        "Srikakulam": {
          "Srikakulam": { latitude: 18.2954, longitude: 83.8930 },
          "Vizianagaram": { latitude: 17.6834, longitude: 83.2848 },
          "Tekkali": { latitude: 18.2926, longitude: 83.7228 },
          "Palakonda": { latitude: 18.3098, longitude: 83.4980 },
          "Rajam": { latitude: 18.3175, longitude: 83.3758 },
          "Narasannapeta": { latitude: 18.2390, longitude: 83.5308 },
          "Hiramandalam": { latitude: 18.3717, longitude: 83.4191 }
        },
        "Visakhapatnam": {
          "Visakhapatnam": { latitude: 17.6868, longitude: 83.2185 },
          "Anakapalli": { latitude: 17.6860, longitude: 83.0775 },
          "Narsipatnam": { latitude: 17.3396, longitude: 81.7833 },
          "Tuni": { latitude: 17.3330, longitude: 82.8506 },
          "Paderu": { latitude: 17.7111, longitude: 82.4428 },
          "Bheemunipatnam": { latitude: 17.9310, longitude: 83.4663 },
          "Yelamanchili": { latitude: 17.2220, longitude: 81.5612 }
        },
        "Vizianagaram": {
          "Vizianagaram": { latitude: 17.6777, longitude: 83.2875 },
          "Parvathipuram": { latitude: 18.2765, longitude: 83.4696 },
          "Bobbili": { latitude: 18.5666, longitude: 83.2807 },
          "Salur": { latitude: 18.2733, longitude: 83.0580 },
          "Nellimarla": { latitude: 17.6225, longitude: 83.2583 },
          "Dattirajeru": { latitude: 18.0852, longitude: 83.3967 },
          "Kurupam": { latitude: 18.3976, longitude: 83.2498 }
        },
        "West Godavari": {
          "Eluru": { latitude: 16.7095, longitude: 81.0981 },
          "Bhimavaram": { latitude: 16.5492, longitude: 81.5281 },
          "Narasapur": { latitude: 16.4392, longitude: 81.7292 },
          "Jangareddygudem": { latitude: 16.8171, longitude: 81.6561 },
          "Palacole": { latitude: 16.3511, longitude: 81.6425 },
          "Tadepalligudem": { latitude: 16.8336, longitude: 81.5264 },
          "Yelamanchili": { latitude: 16.3938, longitude: 81.6810 }
        },
        "YSR Kadapa": {
    "Kadapa": { latitude: "14.4673", longitude: "78.8242" },
    "Proddatur": { latitude: "14.7502", longitude: "78.5481" },
    "Rajampet": { latitude: "14.1951", longitude: "79.1572" },
    "Jammalamadugu": { latitude: "14.8444", longitude: "78.3889" },
    "Pulivendula": { latitude: "14.4211", longitude: "78.2324" },
    "Mydukur": { latitude: "14.6605", longitude: "78.8233" },
    "Kamalapuram": { latitude: "14.5979", longitude: "78.6452" }
  },
      },
      
      
        "Arunachal Pradesh": {
          "Itanagar": {
            "Itanagar": { latitude: "27.0844", longitude: "93.6053" },
            "Naharlagun": { latitude: "27.1047", longitude: "93.6925" },
            "Banderdewa": { latitude: "27.2991", longitude: "93.7714" },
            "Doimukh": { latitude: "27.2152", longitude: "93.7526" }
          },
          "Tawang": {
            "Tawang": { latitude: "27.5869", longitude: "91.8643" },
            "Lumla": { latitude: "27.7033", longitude: "91.6335" },
            "Jang": { latitude: "27.5930", longitude: "91.9212" },
            "Mago": { latitude: "27.7777", longitude: "92.1700" }
          },
          "Bomdila": {
            "Bomdila": { latitude: "27.2645", longitude: "92.4244" },
            "Dirang": { latitude: "27.3667", longitude: "92.2500" },
            "Kalaktang": { latitude: "27.2086", longitude: "91.8124" }
          },
          "Ziro": {
            "Ziro": { latitude: "27.5516", longitude: "93.8364" },
            "Hapoli": { latitude: "27.5415", longitude: "93.8269" },
            "Raga": { latitude: "27.4776", longitude: "93.7653" }
          },
          "Tezu": {
            "Tezu": { latitude: "27.9333", longitude: "96.1285" },
            "Sunpura": { latitude: "27.9177", longitude: "96.1506" },
            "Lohitpur": { latitude: "27.9931", longitude: "96.0937" }
          },
          "Pasighat": {
            "Pasighat": { latitude: "28.0669", longitude: "95.3264" },
            "Mebo": { latitude: "28.2836", longitude: "95.4884" },
            "Sille": { latitude: "28.1228", longitude: "95.3642" }
          },
          "Yingkiong": {
            "Yingkiong": { latitude: "28.6434", longitude: "95.0355" },
            "Mariyang": { latitude: "28.6328", longitude: "95.0581" },
            "Tuting": { latitude: "28.9850", longitude: "94.8366" }
          }
        },
        "Assam": {
          "Guwahati": {
            "Guwahati": { latitude: "26.1445", longitude: "91.7362" },
            "Dispur": { latitude: "26.1365", longitude: "91.8034" },
            "Barpeta": { latitude: "26.3192", longitude: "91.0086" },
            "Nalbari": { latitude: "26.4495", longitude: "91.4419" },
            "Amingaon": { latitude: "26.1640", longitude: "91.6340" }
          },
          "Silchar": {
            "Silchar": { latitude: "24.8333", longitude: "92.7789" },
            "Haflong": { latitude: "25.1639", longitude: "93.0176" },
            "Lakhipur": { latitude: "24.7999", longitude: "92.8205" }
          },
          "Dibrugarh": {
            "Dibrugarh": { latitude: "27.4728", longitude: "94.9119" },
            "Tinsukia": { latitude: "27.4922", longitude: "95.3585" },
            "Naharkatia": { latitude: "27.2941", longitude: "95.3411" }
          },
          "Jorhat": {
            "Jorhat": { latitude: "26.7465", longitude: "94.2026" },
            "Golaghat": { latitude: "26.5117", longitude: "93.9638" },
            "Mariani": { latitude: "26.6589", longitude: "94.3155" }
          },
          "Nagaon": {
            "Nagaon": { latitude: "26.3464", longitude: "92.6847" },
            "Raha": { latitude: "26.2283", longitude: "92.5846" },
            "Kaliabor": { latitude: "26.4828", longitude: "92.8841" }
          },
          "Bongaigaon": {
            "Bongaigaon": { latitude: "26.4770", longitude: "90.5567" },
            "New Bongaigaon": { latitude: "26.4877", longitude: "90.5514" },
            "Abhayapuri": { latitude: "26.3307", longitude: "90.6864" }
          },
          "Tezpur": {
            "Tezpur": { latitude: "26.6510", longitude: "92.7926" },
            "Rangapara": { latitude: "26.8243", longitude: "92.6679" },
            "Gohpur": { latitude: "26.8816", longitude: "93.6149" }
          }
        },
        "Bihar": {
          "Patna": {
            "Patna": { latitude: '25.5941', longitude: '85.1376' },
            "Danapur": { latitude: '25.6376', longitude: '85.0461' },
            "Patna City": { latitude: '25.6022', longitude: '85.1667' },
            "Bakhtiyarpur": { latitude: '25.4616', longitude: '85.5313' }
          },
          "Gaya": {
            "Gaya": { latitude: '24.7914', longitude: '85.0002' },
            "Bodh Gaya": { latitude: '24.6951', longitude: '84.9913' },
            "Sherghati": { latitude: '24.5595', longitude: '84.7924' }
          },
          "Bhagalpur": {
            "Bhagalpur": { latitude: '25.2424', longitude: '86.9842' },
            "Kahalgaon": { latitude: '25.2606', longitude: '87.2646' },
            "Naugachia": { latitude: '25.3947', longitude: '87.0974' }
          },
          "Muzaffarpur": {
            "Muzaffarpur": { latitude: '26.1209', longitude: '85.3647' },
            "Sitamarhi": { latitude: '26.5957', longitude: '85.4884' },
            "Sheohar": { latitude: '26.5123', longitude: '85.2976' }
          },
          "Darbhanga": {
            "Darbhanga": { latitude: '26.1542', longitude: '85.8918' },
            "Madhubani": { latitude: '26.3537', longitude: '86.0714' },
            "Jhanjharpur": { latitude: '26.2648', longitude: '86.2637' }
          },
          "Munger": {
            "Munger": { latitude: '25.3741', longitude: '86.4735' },
            "Jamalpur": { latitude: '25.3122', longitude: '86.4885' },
            "Lakhisarai": { latitude: '25.1629', longitude: '86.0919' }
          },
          "Nalanda": {
            "Nalanda": { latitude: '25.1358', longitude: '85.4437' },
            "Rajgir": { latitude: '25.0269', longitude: '85.4203' },
            "Bihar Sharif": { latitude: '25.2018', longitude: '85.5232' }
          }
        },
        "Chhattisgarh": {
          "Raipur": {
            "Raipur": { latitude: '21.2514', longitude: '81.6296' },
            "Bhilai": { latitude: '21.1938', longitude: '81.3509' },
            "Durg": { latitude: '21.1904', longitude: '81.2849' },
            "Bilaspur": { latitude: '22.0796', longitude: '82.1391' },
            "Korba": { latitude: '22.3595', longitude: '82.7501' }
          },
          "Bilaspur": {
            "Bilaspur": { latitude: '22.0796', longitude: '82.1391' },
            "Mungeli": { latitude: '22.0656', longitude: '81.6864' },
            "Tilda": { latitude: '21.5517', longitude: '81.7956' }
          },
          "Durg": {
            "Durg": { latitude: '21.1904', longitude: '81.2849' },
            "Bhilai": { latitude: '21.1938', longitude: '81.3509' },
            "Jamul": { latitude: '21.1067', longitude: '81.3806' }
          },
          "Jagdalpur": {
            "Jagdalpur": { latitude: '19.0745', longitude: '82.0087' },
            "Bastar": { latitude: '19.1073', longitude: '81.9517' },
            "Kanker": { latitude: '20.2704', longitude: '81.4928' }
          },
          "Korba": {
            "Korba": { latitude: '22.3595', longitude: '82.7501' },
            "Katghora": { latitude: '22.5044', longitude: '82.5426' },
            "Pali": { latitude: '23.1751', longitude: '81.0511' }
          },
          "Rajnandgaon": {
            "Rajnandgaon": { latitude: '21.0974', longitude: '81.0379' },
            "Dongargarh": { latitude: '21.1882', longitude: '80.7556' },
            "Khairagarh": { latitude: '21.4155', longitude: '80.9801' }
          },
          "Bhilai": {
            "Bhilai": { latitude: '21.1938', longitude: '81.3509' },
            "Durg": { latitude: '21.1904', longitude: '81.2849' },
            "Jamul": { latitude: '21.1067', longitude: '81.3806' }
          },
        },

      
         
            "Goa": {
              "Panaji": {
                "Panaji": { latitude: '15.4909', longitude: '73.8278' },
                "Margao": { latitude: '15.2993', longitude: '73.5085' },
                "Vasco da Gama": { latitude: '15.3834', longitude: '73.8258' },
                "Mapusa": { latitude: '15.5502', longitude: '73.8093' },
                "Ponda": { latitude: '15.4474', longitude: '73.9501' }
              },
              "Margao": {
                "Margao": { latitude: '15.2993', longitude: '73.5085' },
                "Cortalim": { latitude: '15.4094', longitude: '73.9124' },
                "Bicholim": { latitude: '15.6080', longitude: '73.8101' }
              }
            },
            "Gujarat": {
              "Ahmedabad": {
                "Ahmedabad": { latitude: '23.0225', longitude: '72.5714' },
                "Gandhinagar": { latitude: '23.2156', longitude: '72.6369' },
                "Anand": { latitude: '22.5608', longitude: '72.9261' }
              },
              "Surat": {
                "Surat": { latitude: '21.1702', longitude: '72.8311' },
                "Navsari": { latitude: '20.9517', longitude: '73.3268' },
                "Valsad": { latitude: '20.6167', longitude: '73.0833' }
              },
              "Vadodara": {
                "Vadodara": { latitude: '22.3074', longitude: '73.1812' },
                "Anand": { latitude: '22.5608', longitude: '72.9261' },
                "Chhota Udaipur": { latitude: '22.1285', longitude: '73.6936' }
              },
              "Rajkot": {
                "Rajkot": { latitude: '22.3039', longitude: '70.8022' },
                "Gondal": { latitude: '21.9176', longitude: '70.7833' },
                "Wankaner": { latitude: '22.5167', longitude: '70.1167' }
              },
              "Gandhinagar": {
                "Gandhinagar": { latitude: '23.2156', longitude: '72.6369' },
                "Kalol": { latitude: '23.2634', longitude: '72.5590' },
                "Mansa": { latitude: '23.1571', longitude: '72.4355' }
              },
              "Junagadh": {
                "Junagadh": { latitude: '21.5216', longitude: '70.4577' },
                "Gir Somnath": { latitude: '20.9794', longitude: '70.7018' },
                "Veraval": { latitude: '20.9167', longitude: '70.3667' }
              },
              "Bhavnagar": {
                "Bhavnagar": { latitude: '21.7714', longitude: '72.1491' },
                "Palitana": { latitude: '21.5481', longitude: '71.8090' },
                "Mahuva": { latitude: '21.2725', longitude: '71.8356' }
              }
            },
            "Haryana": {
              "Chandigarh": {
                "Chandigarh": { latitude: '30.7333', longitude: '76.7794' },
                "Panchkula": { latitude: '30.6954', longitude: '76.8550' },
                "Mohali": { latitude: '30.6944', longitude: '76.7179' }
              },
              "Faridabad": {
                "Faridabad": { latitude: '28.4082', longitude: '77.3178' },
                "Ballabgarh": { latitude: '28.1991', longitude: '77.2975' },
                "Sohna": { latitude: '28.2780', longitude: '77.1145' }
              },
              "Gurgaon": {
                "Gurgaon": { latitude: '28.4595', longitude: '77.0266' },
                "Manesar": { latitude: '28.2410', longitude: '76.9641' },
                "Pataudi": { latitude: '28.3242', longitude: '76.7730' }
              },
              "Ambala": {
                "Ambala": { latitude: '30.3784', longitude: '76.7804' },
                "Jagadhri": { latitude: '30.1270', longitude: '77.3088' },
                "Yamunanagar": { latitude: '30.1336', longitude: '77.2827' }
              },
              "Hisar": {
                "Hisar": { latitude: '29.1498', longitude: '75.5463' },
                "Fatehabad": { latitude: '29.5225', longitude: '75.4547' },
                "Sirsa": { latitude: '29.5320', longitude: '75.0186' }
              },
              "Panipat": {
                "Panipat": { latitude: '29.3919', longitude: '76.9637' },
                "Samalkha": { latitude: '29.3267', longitude: '76.9452' },
                "Khalilpur": { latitude: '29.3097', longitude: '76.9767' }
              },
              "Karnal": {
                "Karnal": { latitude: '29.6854', longitude: '76.9909' },
                "Nilokheri": { latitude: '29.6167', longitude: '76.9833' },
                "Gharaunda": { latitude: '29.6522', longitude: '76.9578' }
              }
            },
            "Himachal Pradesh": {
              "Shimla": {
                "Shimla": { latitude: '31.1048', longitude: '77.1728' },
                "Solan": { latitude: '30.9121', longitude: '77.1131' },
                "Mandi": { latitude: '31.7034', longitude: '76.9320' }
              },
              "Manali": {
                "Manali": { latitude: '32.2396', longitude: '77.1885' },
                "Kullu": { latitude: '31.9633', longitude: '77.1003' },
                "Naggar": { latitude: '32.2140', longitude: '77.3082' }
              },
              "Dharamshala": {
                "Dharamshala": { latitude: '32.2194', longitude: '76.3245' },
                "Kangra": { latitude: '32.0812', longitude: '76.2735' },
                "Palampur": { latitude: '32.1055', longitude: '76.6105' }
              },
              "Solan": {
                "Solan": { latitude: '30.9121', longitude: '77.1131' },
                "Kasauli": { latitude: '30.8924', longitude: '77.0333' },
                "Nalagarh": { latitude: '30.9896', longitude: '76.7838' }
              },
              "Mandi": {
                "Mandi": { latitude: '31.7034', longitude: '76.9320' },
                "Sundernagar": { latitude: '31.5119', longitude: '76.9692' },
                "Padhar": { latitude: '31.7700', longitude: '76.9600' }
              },
              "Kullu": {
                "Kullu": { latitude: '31.9633', longitude: '77.1003' },
                "Manali": { latitude: '32.2396', longitude: '77.1885' },
                "Bhuntar": { latitude: '31.9084', longitude: '77.1547' }
              },
              "Hamirpur": {
                "Hamirpur": { latitude: '31.7147', longitude: '76.5944' },
                "Nadaun": { latitude: '31.7494', longitude: '76.6141' },
                "Sujanpur": { latitude: '31.6261', longitude: '76.6017' }
              }
            },
            "Jharkhand": {
              "Ranchi": {
                "Ranchi": { latitude: '23.3441', longitude: '85.3096' },
                "Khunti": { latitude: '23.0583', longitude: '85.3722' },
                "Lohardaga": { latitude: '23.1748', longitude: '84.5700' }
              },
              "Jamshedpur": {
                "Jamshedpur": { latitude: '22.8046', longitude: '86.2028' },
                "Ghatshila": { latitude: '22.5512', longitude: '86.4194' },
                "Mango": { latitude: '22.8233', longitude: '86.2038' }
              },
              "Dhanbad": {
                "Dhanbad": { latitude: '23.7957', longitude: '86.4304' },
                "Bokaro": { latitude: '23.7005', longitude: '85.9819' },
                "Sindri": { latitude: '23.6919', longitude: '86.3757' }
              },
              "Bokaro": {
                "Bokaro": { latitude: '23.7005', longitude: '85.9819' },
                "Chas": { latitude: '23.6844', longitude: '85.9604' },
                "Bermo": { latitude: '23.7465', longitude: '85.8974' }
              },
              "Hazaribagh": {
                "Hazaribagh": { latitude: '23.9843', longitude: '85.3456' },
                "Chatra": { latitude: '24.0494', longitude: '84.8736' },
                "Koderma": { latitude: '24.4896', longitude: '85.5985' }
              },
              "Dumka": {
                "Dumka": { latitude: '24.2640', longitude: '87.2647' },
                "Jamtara": { latitude: '24.3631', longitude: '86.7014' },
                "Deoghar": { latitude: '24.4800', longitude: '86.6964' }
              },
              "Giridih": {
                "Giridih": { latitude: '24.2004', longitude: '86.2754' },
                "Dumri": { latitude: '24.2266', longitude: '86.1575' },
                "Pirtand": { latitude: '24.1596', longitude: '86.2874' }
              }
            },
            "Karnataka": {
              "Bangalore": {
                "Bangalore": { latitude: '12.9716', longitude: '77.5946' },
                "Mysore": { latitude: '12.2958', longitude: '76.6394' },
                "Tumkur": { latitude: '13.3391', longitude: '77.1012' }
              },
              "Mysore": {
                "Mysore": { latitude: '12.2958', longitude: '76.6394' },
                "Nanjangud": { latitude: '12.2624', longitude: '76.7070' },
                "Mandya": { latitude: '12.5231', longitude: '76.8977' }
              },
              "Hubli": {
                "Hubli": { latitude: '15.3647', longitude: '75.1268' },
                "Dharwad": { latitude: '15.4584', longitude: '75.0123' },
                "Bagalkot": { latitude: '16.1804', longitude: '75.7160' }
              },
              "Dharwad": {
                "Dharwad": { latitude: '15.4584', longitude: '75.0123' },
                "Hubli": { latitude: '15.3647', longitude: '75.1268' },
                "Gadag": { latitude: '15.4076', longitude: '75.6671' }
              },
              "Mangalore": {
                "Mangalore": { latitude: '12.9141', longitude: '74.8560' },
                "Udupi": { latitude: '13.3401', longitude: '76.7882' },
                "Kasaragod": { latitude: '12.5061', longitude: '74.9828' }
              },
              "Bellary": {
                "Bellary": { latitude: '15.1395', longitude: '76.9215' },
                "Hospet": { latitude: '15.2747', longitude: '76.3985' },
                "Sandur": { latitude: '15.2544', longitude: '76.9030' }
              },
              "Gulbarga": {
                "Gulbarga": { latitude: '17.3292', longitude: '76.8311' },
                "Raichur": { latitude: '16.2074', longitude: '77.3564' },
                "Bidar": { latitude: '17.9125', longitude: '77.5216' }
              }
            },
            "Kerala": {
              "Thiruvananthapuram": {
                "Thiruvananthapuram": { latitude: '8.5241', longitude: '76.9366' },
                "Kollam": { latitude: '8.8932', longitude: '76.6146' },
                "Nagercoil": { latitude: '8.1805', longitude: '77.4347' }
              },
              "Kochi": {
                "Kochi": { latitude: '9.9312', longitude: '76.2673' },
                "Ernakulam": { latitude: '9.9816', longitude: '76.2999' },
                "Alappuzha": { latitude: '9.4981', longitude: '76.3384' }
              },
              "Kozhikode": {
                "Kozhikode": { latitude: '11.2588', longitude: '75.7804' },
                "Malappuram": { latitude: '11.0667', longitude: '76.0833' },
                "Wayanad": { latitude: '11.6820', longitude: '76.0148' }
              },
              "Kottayam": {
                "Kottayam": { latitude: '9.5916', longitude: '76.5228' },
                "Pala": { latitude: '9.6203', longitude: '76.6472' },
                "Changanassery": { latitude: '9.4541', longitude: '76.5454' }
              },
              "Palakkad": {
                "Palakkad": { latitude: '10.7764', longitude: '76.6544' },
                "Ottapalam": { latitude: '10.7633', longitude: '76.3188' },
                "Chittur": { latitude: '10.7301', longitude: '76.7857' }
              },
              "Thrissur": {
                "Thrissur": { latitude: '10.5276', longitude: '76.2144' },
                "Irinjalakuda": { latitude: '10.3861', longitude: '76.2827' },
                "Thriprayar": { latitude: '10.3960', longitude: '76.3253' }
              },
              "Alappuzha": {
                "Alappuzha": { latitude: '9.4981', longitude: '76.3384' },
                "Cherthala": { latitude: '9.6287', longitude: '76.3541' },
                "Mavelikkara": { latitude: '9.2339', longitude: '76.5842' }
              }
            },
            "Ladakh": {
              "Leh": {
                "Leh": { latitude: '34.1526', longitude: '77.5789' },
                "Nubra Valley": { latitude: '34.5500', longitude: '77.4167' },
                "Zanskar": { latitude: '33.5298', longitude: '76.0674' }
              },
              "Kargil": {
                "Kargil": { latitude: '34.5511', longitude: '76.1324' },
                "Drass": { latitude: '34.4833', longitude: '76.2167' },
                "Sankoo": { latitude: '34.5712', longitude: '76.0108' }
              }
            },
            "Lakshadweep": {
              "Kavaratti": {
                "Kavaratti": { latitude: '10.5667', longitude: '72.6167' },
                "Agatti": { latitude: '10.8448', longitude: '72.1997' },
                "Minicoy": { latitude: '8.2958', longitude: '73.0721' }
              }
            },
            "Madhya Pradesh": {
              "Bhopal": {
                "Bhopal": { latitude: '23.2599', longitude: '77.4126' },
                "Raisen": { latitude: '23.2676', longitude: '77.9355' },
                "Sehore": { latitude: '23.1937', longitude: '77.0775' }
              },
              "Indore": {
                "Indore": { latitude: '22.7196', longitude: '75.8577' },
                "Dewas": { latitude: '22.9634', longitude: '76.0464' },
                "Ujjain": { latitude: '23.1815', longitude: '75.7768' }
              },
              "Jabalpur": {
                "Jabalpur": { latitude: '23.1815', longitude: '79.9554' },
                "Mandla": { latitude: '22.3581', longitude: '80.1750' },
                "Katni": { latitude: '23.8261', longitude: '80.3940' }
              },
              "Gwalior": {
                "Gwalior": { latitude: '26.2183', longitude: '78.1828' },
                "Morena": { latitude: '26.5024', longitude: '78.3280' },
                "Bhind": { latitude: '26.5726', longitude: '78.6874' }
              },
              "Sagar": {
                "Sagar": { latitude: '23.4704', longitude: '78.7369' },
                "Damoh": { latitude: '23.8200', longitude: '79.4311' },
                "Khurai": { latitude: '23.4350', longitude: '78.6620' }
              },
              "Rewa": {
                "Rewa": { latitude: '24.5351', longitude: '81.2995' },
                "Sidhi": { latitude: '23.2862', longitude: '81.5787' },
                "Satna": { latitude: '24.5704', longitude: '80.8215' }
              },
              "Satna": {
                "Satna": { latitude: '24.5704', longitude: '80.8215' },
                "Maihar": { latitude: '24.3061', longitude: '80.7472' },
                "Amarpatan": { latitude: '24.4994', longitude: '80.7772' }
              }
            },
            "Maharashtra": {
              "Mumbai": {
                "Mumbai": { latitude: '19.0760', longitude: '72.8777' },
                "Thane": { latitude: '19.2183', longitude: '72.9781' },
                "Navi Mumbai": { latitude: '19.0370', longitude: '73.0296' }
              },
              "Pune": {
                "Pune": { latitude: '18.5204', longitude: '73.8567' },
                "Pimpri-Chinchwad": { latitude: '18.6281', longitude: '73.8150' },
                "Talegaon": { latitude: '18.9351', longitude: '73.8260' }
              },
              "Nagpur": {
                "Nagpur": { latitude: '21.1458', longitude: '79.0882' },
                "Wardha": { latitude: '20.7467', longitude: '78.5941' },
                "Chandrapur": { latitude: '19.9456', longitude: '79.2951' }
              },
              "Nashik": {
                "Nashik": { latitude: '19.9975', longitude: '73.7898' },
                "Malegaon": { latitude: '20.5550', longitude: '74.5190' },
                "Satana": { latitude: '20.3314', longitude: '74.3748' }
              },
              "Aurangabad": {
                "Aurangabad": { latitude: '19.8762', longitude: '75.3433' },
                "Jalna": { latitude: '19.8347', longitude: '75.8804' },
                "Beed": { latitude: '19.8787', longitude: '75.5620' }
              },
              "Solapur": {
                "Solapur": { latitude: '17.6599', longitude: '75.9064' },
                "Pandharpur": { latitude: '17.7366', longitude: '75.2177' },
                "Akkalkot": { latitude: '17.4444', longitude: '76.1102' }
              },
              "Kolhapur": {
                "Kolhapur": { latitude: '16.7056', longitude: '74.2144' },
                "Ichalkaranji": { latitude: '16.7166', longitude: '74.3472' },
                "Karvir": { latitude: '16.7000', longitude: '74.2167' }
              }
            },
            "Manipur": {
              "Imphal": {
                "Imphal": { latitude: '24.8170', longitude: '93.9368' },
                "Thoubal": { latitude: '24.7503', longitude: '93.5036' },
                "Bishnupur": { latitude: '24.6518', longitude: '93.6072' }
              },
              "Churachandpur": {
                "Churachandpur": { latitude: '24.3167', longitude: '93.6667' },
                "Tuibong": { latitude: '24.3333', longitude: '93.6167' },
                "Henglep": { latitude: '24.2500', longitude: '93.7500' }
              },
              "Ukhrul": {
                "Ukhrul": { latitude: '25.0833', longitude: '94.3667' },
                "Jessami": { latitude: '25.2667', longitude: '94.3833' },
                "Kamjong": { latitude: '25.3667', longitude: '94.5333' }
              },
              "Senapati": {
                "Senapati": { latitude: '24.4167', longitude: '93.6833' },
                "Mao": { latitude: '24.4000', longitude: '93.7333' },
                "Kangpokpi": { latitude: '24.4667', longitude: '93.8000' }
              }
            },
            "Meghalaya": {
              "Shillong": {
                "Shillong": { latitude: '25.5788', longitude: '91.8933' },
                "Jowai": { latitude: '25.5333', longitude: '92.0833' },
                "Tura": { latitude: '25.5275', longitude: '90.2172' }
              },
              "Tura": {
                "Tura": { latitude: '25.5275', longitude: '90.2172' },
                "Phulbari": { latitude: '25.5167', longitude: '90.4167' },
                "Williamnagar": { latitude: '25.5167', longitude: '90.5333' }
              },
              "Jowai": {
                "Jowai": { latitude: '25.5333', longitude: '92.0833' },
                "Mookym": { latitude: '25.5333', longitude: '92.0833' },
                "Nartiang": { latitude: '25.5333', longitude: '92.0833' }
              }
            },
            "Mizoram": {
              "Aizawl": {
                "Aizawl": { latitude: '23.1645', longitude: '92.9376' },
                "Lunglei": { latitude: '22.8875', longitude: '92.7364' },
                "Champhai": { latitude: '23.1614', longitude: '92.7214' }
              },
              "Lunglei": {
                "Lunglei": { latitude: '22.8875', longitude: '92.7364' },
                "Siaha": { latitude: '22.8333', longitude: '92.8667' },
                "Kolasib": { latitude: '24.1333', longitude: '92.7167' }
              },
              "Champhai": {
                "Champhai": { latitude: '23.1614', longitude: '92.7214' },
                "Lawngtlai": { latitude: '22.6483', longitude: '92.7222' },
                "Serchhip": { latitude: '23.1667', longitude: '92.7500' }
              }
            },
            "Nagaland": {
              "Kohima": {
                "Kohima": { latitude: '25.6740', longitude: '94.1149' },
                "Dimapur": { latitude: '25.9043', longitude: '93.7151' },
                "Mokokchung": { latitude: '26.2902', longitude: '94.5527' }
              },
              "Dimapur": {
                "Dimapur": { latitude: '25.9043', longitude: '93.7151' },
                "Chumukedima": { latitude: '25.9000', longitude: '93.7667' },
                "Niuland": { latitude: '25.7333', longitude: '93.6667' }
              },
              "Mokokchung": {
                "Mokokchung": { latitude: '26.2902', longitude: '94.5527' },
                "Longleng": { latitude: '26.2656', longitude: '94.4366' },
                "Mon": { latitude: '26.3333', longitude: '94.2000' }
              }
            },
            "Odisha": {
              "Bhubaneswar": {
                "Bhubaneswar": { latitude: '20.2961', longitude: '85.8245' },
                "Cuttack": { latitude: '20.4625', longitude: '85.8828' },
                "Rourkela": { latitude: '22.2646', longitude: '84.8318' }
              },
              "Berhampur": {
                "Berhampur": { latitude: '19.3144', longitude: '84.7967' },
                "Ganjam": { latitude: '19.3400', longitude: '84.7800' },
                "Kandhamal": { latitude: '19.2333', longitude: '84.1667' }
              },
              "Kendujhar": {
                "Kendujhar": { latitude: '21.6137', longitude: '85.5987' },
                "Joda": { latitude: '22.1147', longitude: '85.5977' },
                "Barbil": { latitude: '22.0772', longitude: '85.6508' }
              },
              "Ganjam": {
                "Ganjam": { latitude: '19.3400', longitude: '84.7800' },
                "Berhampur": { latitude: '19.3144', longitude: '84.7967' },
                "Kandhamal": { latitude: '19.2333', longitude: '84.1667' }
              },
              "Rayagada": {
                "Rayagada": { latitude: '19.2952', longitude: '82.4115' },
                "Koraput": { latitude: '19.2947', longitude: '82.7190' },
                "Kalahandi": { latitude: '19.2416', longitude: '82.8527' }
              }
            },
            
              "Punjab": {
                "Chandigarh": {
                  "Chandigarh": { latitude: '30.7333', longitude: '76.7794' },
                  "Panchkula": { latitude: '30.6931', longitude: '76.8504' },
                  "Mohali": { latitude: '30.6883', longitude: '76.7176' }
                },
                "Amritsar": {
                  "Amritsar": { latitude: '31.6340', longitude: '74.8723' },
                  "Tarn Taran": { latitude: '31.4858', longitude: '74.9164' },
                  "Ajnala": { latitude: '31.6778', longitude: '74.8622' }
                },
                "Ludhiana": {
                  "Ludhiana": { latitude: '30.9009', longitude: '75.8573' },
                  "Khanna": { latitude: '30.6894', longitude: '76.1721' },
                  "Mandi Gobindgarh": { latitude: '30.6824', longitude: '76.1717' }
                },
                "Jalandhar": {
                  "Jalandhar": { latitude: '31.3260', longitude: '75.5762' },
                  "Phagwara": { latitude: '31.2544', longitude: '75.7798' },
                  "Kapurthala": { latitude: '31.3613', longitude: '75.3875' }
                },
                "Patiala": {
                  "Patiala": { latitude: '30.3340', longitude: '76.3860' },
                  "Rajpura": { latitude: '30.4910', longitude: '76.5868' },
                  "Samana": { latitude: '30.2365', longitude: '76.3895' }
                },
                "Mohali": {
                  "Mohali": { latitude: '30.6883', longitude: '76.7176' },
                  "Kharar": { latitude: '30.6820', longitude: '76.6670' },
                  "Derabassi": { latitude: '30.5500', longitude: '76.7670' }
                }
              },
              "Rajasthan": {
                "Jaipur": {
                  "Jaipur": { latitude: '26.9124', longitude: '75.7873' },
                  "Ajmer": { latitude: '26.4515', longitude: '74.6399' },
                  "Alwar": { latitude: '27.0998', longitude: '76.6120' }
                },
                "Jodhpur": {
                  "Jodhpur": { latitude: '26.2958', longitude: '73.3000' },
                  "Pali": { latitude: '25.7700', longitude: '73.3425' },
                  "Osian": { latitude: '26.2900', longitude: '73.7700' }
                },
                "Udaipur": {
                  "Udaipur": { latitude: '24.5713', longitude: '73.6915' },
                  "Rajsamand": { latitude: '25.0438', longitude: '73.6010' },
                  "Chittorgarh": { latitude: '24.8790', longitude: '74.6291' }
                },
                "Kota": {
                  "Kota": { latitude: '25.2138', longitude: '75.8514' },
                  "Baran": { latitude: '25.0553', longitude: '76.6110' },
                  "Bundi": { latitude: '25.4581', longitude: '75.6214' }
                },
                "Bikaner": {
                  "Bikaner": { latitude: '28.0229', longitude: '73.3114' },
                  "Nagaur": { latitude: '27.2090', longitude: '73.7138' },
                  "Jhunjhunu": { latitude: '28.1127', longitude: '75.3943' }
                },
                "Jaisalmer": {
                  "Jaisalmer": { latitude: '26.9157', longitude: '70.9167' },
                  "Barmer": { latitude: '25.7513', longitude: '71.4302' },
                  "Phalodi": { latitude: '27.1717', longitude: '72.3813' }
                },
                "Alwar": {
                  "Alwar": { latitude: '27.0998', longitude: '76.6120' },
                  "Behror": { latitude: '27.6650', longitude: '76.1519' },
                  "Rajgarh": { latitude: '27.4883', longitude: '76.6590' }
                }
              },
              "Sikkim": {
                "Gangtok": {
                  "Gangtok": { latitude: '27.3359', longitude: '88.6139' },
                  "Namchi": { latitude: '27.1120', longitude: '88.6224' },
                  "Mangan": { latitude: '27.3604', longitude: '88.6120' }
                },
                "Namchi": {
                  "Namchi": { latitude: '27.1120', longitude: '88.6224' },
                  "Ravangla": { latitude: '27.1690', longitude: '88.6375' },
                  "Jorethang": { latitude: '27.1200', longitude: '88.6036' }
                },
                "Mangan": {
                  "Mangan": { latitude: '27.3604', longitude: '88.6120' },
                  "Chungthang": { latitude: '27.4075', longitude: '88.6010' },
                  "Lachen": { latitude: '27.7375', longitude: '88.6070' }
                }
              },
              "Tamil Nadu": {
    "Ariyalur": {
        "Ariyalur": { "latitude": 11.1136, "longitude": 78.6234 },
        "Sendurai": { "latitude": 11.2114, "longitude": 78.8893 },
        "Udayarpalayam": { "latitude": 11.1882, "longitude": 78.8603 }
    },
    "Chennai": {
        "Arakkonam": { "latitude": 13.0858, "longitude": 79.6557 },
        "Chennai": { "latitude": 13.0827, "longitude": 80.2707 },
        "Kanchipuram": { "latitude": 12.8354, "longitude": 79.7077 },
        "Nungambakkam": { "latitude": 13.0661, "longitude": 80.2470 },
        "Tambaram": { "latitude": 12.9173, "longitude": 80.1498 },
        "Tiruvallur": { "latitude": 13.1616, "longitude": 79.7740 }
    },
    "Chengalpattu": {
        "Chengalpattu": { "latitude": 12.7351, "longitude": 79.9614 },
        "Maraimalai Nagar": { "latitude": 12.8377, "longitude": 79.9785 },
        "Pallavaram": { "latitude": 12.9827, "longitude": 80.1824 },
        "Urapakkam": { "latitude": 12.8922, "longitude": 80.1513 }
    },
    "Coimbatore": {
        "Avinashi": { "latitude": 11.2442, "longitude": 77.2563 },
        "Coimbatore": { "latitude": 11.0168, "longitude": 76.9558 },
        "Mettupalayam": { "latitude": 11.2726, "longitude": 76.6527 },
        "Nilgiris": { "latitude": 11.4100, "longitude": 76.6968 },
        "Pollachi": { "latitude": 10.6873, "longitude": 77.0026 },
        "Tirupur": { "latitude": 11.1084, "longitude": 77.3394 }
    },
    "Cuddalore": {
        "Cuddalore": { "latitude": 11.7481, "longitude": 79.8310 },
        "Kattumannarkoil": { "latitude": 11.6980, "longitude": 79.6725 },
        "Nellikuppam": { "latitude": 11.7092, "longitude": 79.8272 },
        "Panruti": { "latitude": 11.6605, "longitude": 79.6573 }
    },
    "Dharmapuri": {
        "Dharmapuri": { "latitude": 12.1263, "longitude": 78.1621 },
        "Harur": { "latitude": 12.1767, "longitude": 78.3878 },
        "Palacode": { "latitude": 12.1734, "longitude": 78.6284 },
        "Pappireddipatti": { "latitude": 12.1301, "longitude": 78.3051 }
    },
    "Dindigul": {
        "Dindigul": { "latitude": 10.3634, "longitude": 77.9816 },
        "Kodaikanal": { "latitude": 10.2381, "longitude": 77.4891 },
        "Natham": { "latitude": 10.3585, "longitude": 77.9260 },
        "Vedasandur": { "latitude": 10.3727, "longitude": 77.9401 }
    },
    "Erode": {
        "Bhavani": { "latitude": 11.6308, "longitude": 77.7485 },
        "Erode": { "latitude": 11.3415, "longitude": 77.7199 },
        "Gobichettipalayam": { "latitude": 11.4945, "longitude": 77.4187 },
        "Mallipalayam": { "latitude": 11.3402, "longitude": 77.6726 },
        "Nambiyur": { "latitude": 11.3005, "longitude": 77.6393 },
        "Perundurai": { "latitude": 11.3183, "longitude": 77.6948 },

        "Siruvalur": { "latitude": 11.4064, "longitude": 77.6794 },
        "Vellode": { "latitude": 11.3074, "longitude": 77.7610 }
    },
    "Kallakurichi": {
        "Kallakurichi": { "latitude": 11.6248, "longitude": 78.7838 },
        "Chinnasalem": { "latitude": 11.5117, "longitude": 78.8902 },
        "Kalvarayan Hills": { "latitude": 11.6550, "longitude": 78.8213 }
    },
    "Kanchipuram": {
        "Kanchipuram": { "latitude": 12.8354, "longitude": 79.7077 },
        "Cheyyar": { "latitude": 12.6272, "longitude": 79.5678 },
        "Sriperumbudur": { "latitude": 12.9706, "longitude": 79.6427 },
        "Vandavasi": { "latitude": 12.3831, "longitude": 79.5391 }
    },
    "Kanyakumari": {
        "Colachel": { "latitude": 8.1253, "longitude": 77.2836 },
        "Kalkulam": { "latitude": 8.4694, "longitude": 77.2355 },
        "Kanyakumari": { "latitude": 8.4336, "longitude": 77.5834 },
        "Nagercoil": { "latitude": 8.1775, "longitude": 77.4330 },
        "Padmanabhapuram": { "latitude": 8.2155, "longitude": 77.3414 }
    },
    "Karur": {
        "Karur": { "latitude": 10.9577, "longitude": 78.0764 },
        "Aravakurichi": { "latitude": 10.8872, "longitude": 78.2591 },
        "Kumarapalayam": { "latitude": 10.9252, "longitude": 78.2116 },
        "Kondattam": { "latitude": 10.9904, "longitude": 78.2905 }
    },
    "Krishnagiri": {
        "Krishnagiri": { "latitude": 12.5204, "longitude": 77.9900 },
        "Hosur": { "latitude": 12.7425, "longitude": 77.8255 },
        "Pochampalli": { "latitude": 12.5011, "longitude": 77.9383 },
        "Rayakottai": { "latitude": 12.5745, "longitude": 77.9316 }
    },
    "Madurai": {
        "Madurai": { "latitude": 9.9194, "longitude": 78.1194 },
        "Dindigul": { "latitude": 10.3634, "longitude": 77.9816 },
        "Sivaganga": { "latitude": 9.8803, "longitude": 78.5728 },
        "Theni": { "latitude": 10.0561, "longitude": 77.5189 }
    },
    "Nagapattinam": {
        "Nagapattinam": { "latitude": 10.7614, "longitude": 79.8320 },
        "Kumbakonam": { "latitude": 10.9645, "longitude": 79.3798 },
        "Thiruvarur": { "latitude": 10.7840, "longitude": 79.5930 },
        "Velankanni": { "latitude": 10.7541, "longitude": 79.9484 }
    },
    "Namakkal": {
        "Namakkal": { "latitude": 11.2056, "longitude": 77.6605 },
        "Rasipuram": { "latitude": 11.1755, "longitude": 77.6668 },
        "Salem": { "latitude": 11.6604, "longitude": 78.1542 },
        "Tiruchengode": { "latitude": 11.2445, "longitude": 77.9400 }
    },
    "Nilgiris": {
        "Coonoor": { "latitude": 11.2173, "longitude": 76.8680 },
        "Kothagiri": { "latitude": 10.2632, "longitude": 76.8472 },
        "Ooty": { "latitude": 11.4142, "longitude": 76.6927 },
        "Pykara": { "latitude": 11.4115, "longitude": 76.7944 }
    },
    "Perambalur": {
        "Perambalur": { "latitude": 11.2111, "longitude": 78.8817 },
        "Kunnam": { "latitude": 11.1830, "longitude": 78.8318 },
        "Veppanthattai": { "latitude": 11.1883, "longitude": 78.9795 }
    },
    "Pudukkottai": {
        "Pudukkottai": { "latitude": 10.3904, "longitude": 78.8247 },
        "Alangudi": { "latitude": 10.4535, "longitude": 78.7102 },
        "Aranthangi": { "latitude": 10.2690, "longitude": 78.7840 },
        "Karaikudi": { "latitude": 10.0764, "longitude": 78.7735 }
    },
    "Ramanathapuram": {
        "Paramakudi": { "latitude": 9.4275, "longitude": 78.5620 },
        "Rameswaram": { "latitude": 9.2881, "longitude": 79.3121 },
        "Ramanathapuram": { "latitude": 9.3540, "longitude": 78.8335 },
        "Sankarankovil": { "latitude": 9.1195, "longitude": 77.5715 }
    },
    "Ranipet": {
        "Ranipet": { "latitude": 12.9200, "longitude": 79.3394 },
        "Arcot": { "latitude": 12.8725, "longitude": 79.3287 },
        "Vellore": { "latitude": 12.9165, "longitude": 79.1325 },
        "Walajah": { "latitude": 12.9180, "longitude": 79.2885 }
    },
    "Salem": {
        "Attur": { "latitude": 11.7418, "longitude": 78.5736 },
        "Dharmapuri": { "latitude": 12.1263, "longitude": 78.1621 },
        "Namakkal": { "latitude": 11.2056, "longitude": 77.6605 },
        "Salem": { "latitude": 11.6604, "longitude": 78.1542 }
    },
    "Sivaganga": {
        "Sivaganga": { "latitude": 9.8803, "longitude": 78.5728 },
        "Karaikudi": { "latitude": 10.0764, "longitude": 78.7735 },
        "Ramanathapuram": { "latitude": 9.3540, "longitude": 78.8335 },
        "Sivaganga": { "latitude": 9.8803, "longitude": 78.5728 }
    },
    "Tenkasi": {
        "Tenkasi": { "latitude": 8.9682, "longitude": 77.2734 },
        "Sankarankovil": { "latitude": 9.1195, "longitude": 77.5715 },
        "Kadayanallur": { "latitude": 9.1431, "longitude": 77.3166 },
        "Aruppukottai": { "latitude": 9.2237, "longitude": 77.9304 }
    },
    "Thanjavur": {
        "Kumbakonam": { "latitude": 10.9645, "longitude": 79.3798 },
        "Nagapattinam": { "latitude": 10.7614, "longitude": 79.8320 },
        "Thanjavur": { "latitude": 10.7867, "longitude": 79.1370 },
        "Tiruvarur": { "latitude": 10.7840, "longitude": 79.5930 }
    },
    "Theni": {
        "Theni": { "latitude": 10.0561, "longitude": 77.5189 },
        "Bodinayakkanur": { "latitude": 10.0920, "longitude": 77.4477 },
        "Periyakulam": { "latitude": 10.2397, "longitude": 77.5584 },
        "Cumbum": { "latitude": 10.2716, "longitude": 77.2567 }
    },
    "Thoothukudi": {
        "Thoothukudi": { "latitude": 8.8000, "longitude": 78.1333 },
        "Tiruchendur": { "latitude": 8.7902, "longitude": 78.1488 },
        "Kovilpatti": { "latitude": 9.1440, "longitude": 77.8651 },
        "Ottapidaram": { "latitude": 8.7873, "longitude": 78.0265 }
    },
    "Tiruchirappalli": {
        "Tiruchirappalli": { "latitude": 10.7905, "longitude": 78.7047 },
        "Karur": { "latitude": 10.9577, "longitude": 78.0764 },
        "Perambalur": { "latitude": 11.2111, "longitude": 78.8817 },
        "Srirangam": { "latitude": 10.7905, "longitude": 78.7000 }
    },
    "Tirunelveli": {
        "Tirunelveli": { "latitude": 8.7106, "longitude": 77.7544 },
        "Nellai": { "latitude": 8.7106, "longitude": 77.7544 },
        "Tenkasi": { "latitude": 8.9682, "longitude": 77.2734 },
        "Cheranmahadevi": { "latitude": 8.7398, "longitude": 77.6321 }
    },
    "Tirupathur": {
        "Tirupathur": { "latitude": 12.3072, "longitude": 78.5747 },
        "Jolarpet": { "latitude": 12.4962, "longitude": 78.5825 },
        "Vaniyambadi": { "latitude": 12.7122, "longitude": 78.6472 },
        "Pochampalli": { "latitude": 12.5011, "longitude": 77.9383 }
    },
    "Tiruppur": {
        "Tiruppur": { "latitude": 11.1084, "longitude": 77.3394 },
        "Kangeyam": { "latitude": 11.1511, "longitude": 77.3062 },
        "Palladam": { "latitude": 11.0878, "longitude": 77.4821 },
        "Udumalaipettai": { "latitude": 11.2368, "longitude": 77.5317 }
    },
    "Tiruvallur": {
        "Tiruvallur": { "latitude": 13.1616, "longitude": 79.7740 },
        "Arakkonam": { "latitude": 13.0858, "longitude": 79.6557 },
        "Poonamallee": { "latitude": 13.0748, "longitude": 80.0926 },
        "Gummidipoondi": { "latitude": 13.2864, "longitude": 80.0450 }
    },
    "Tiruvannamalai": {
        "Tiruvannamalai": { "latitude": 12.2300, "longitude": 79.0740 },
        "Arni": { "latitude": 12.3134, "longitude": 79.3713 },
        "Chetpet": { "latitude": 12.3377, "longitude": 79.3462 },
        "Polur": { "latitude": 12.5451, "longitude": 79.2924 }
    },
    "Tiruvarur": {
        "Tiruvarur": { "latitude": 10.7840, "longitude": 79.5930 },
        "Thiruthuraipoondi": { "latitude": 10.7390, "longitude": 79.5365 },
        "Nannilam": { "latitude": 10.8250, "longitude": 79.5963 },
        "Needamangalam": { "latitude": 10.8477, "longitude": 79.5925 }
    },
    "Vellore": {
        "Arakkonam": { "latitude": 13.0858, "longitude": 79.6557 },
        "Gudiyattam": { "latitude": 12.9551, "longitude": 78.6455 },
        "Ranipet": { "latitude": 12.9200, "longitude": 79.3394 },
        "Vellore": { "latitude": 12.9165, "longitude": 79.1325 }
    },
    "Viluppuram": {
        "Viluppuram": { "latitude": 11.9343, "longitude": 79.4192 },
        "Mangalur": { "latitude": 11.6605, "longitude": 79.4762 },
        "Thirukoilur": { "latitude": 11.7657, "longitude": 79.3712 },
        "Ulundurpet": { "latitude": 11.7123, "longitude": 79.3432 }
    },
    "Virudhunagar": {
        "Virudhunagar": { "latitude": 9.6063, "longitude": 77.9666 },
        "Sivakasi": { "latitude": 9.5397, "longitude": 77.7994 },
        "Srivilliputhur": { "latitude": 9.4870, "longitude": 77.6931 },
        "Aruppukottai": { "latitude": 9.3593, "longitude": 77.9726 }
    }
},

              "Telangana": {
                "Hyderabad": {
                  "Hyderabad": { latitude: '17.3850', longitude: '78.4867' },
                  "Secunderabad": { latitude: '17.4400', longitude: '78.4984' },
                  "Cyberabad": { latitude: '17.4119', longitude: '78.3696' }
                },
                "Warangal": {
                  "Warangal": { latitude: '17.9784', longitude: '79.5941' },
                  "Hanamkonda": { latitude: '17.9784', longitude: '79.5677' },
                  "Kazipet": { latitude: '17.9870', longitude: '79.5567' }
                },
                "Nizamabad": {
                  "Nizamabad": { latitude: '18.6733', longitude: '78.0946' },
                  "Bodhan": { latitude: '18.7050', longitude: '78.0824' },
                  "Kamareddy": { latitude: '18.3356', longitude: '78.6477' }
                },
                "Khammam": {
                  "Khammam": { latitude: '17.2471', longitude: '80.1508' },
                  "Palvancha": { latitude: '17.4000', longitude: '80.6174' },
                  "Madhira": { latitude: '16.9895', longitude: '80.4345' }
                },
                "Karimnagar": {
                  "Karimnagar": { latitude: '17.3594', longitude: '79.2785' },
                  "Jagitial": { latitude: '17.8606', longitude: '78.8771' },
                  "Huzurabad": { latitude: '17.7908', longitude: '78.8821' }
                }
              },
              "Tripura": {
                "Agartala": {
                  "Agartala": { latitude: '23.8315', longitude: '91.2866' },
                  "Udaipur": { latitude: '23.2757', longitude: '91.1084' },
                  "Sabroom": { latitude: '23.1860', longitude: '91.4184' }
                },
                "Dharmanagar": {
                  "Dharmanagar": { latitude: '24.0704', longitude: '92.1542' },
                  "Kailashahar": { latitude: '24.2750', longitude: '92.4700' },
                  "Kumarghat": { latitude: '24.2927', longitude: '92.1415' }
                }
              },
              "Uttar Pradesh": {
                "Lucknow": {
                  "Lucknow": { latitude: '26.8467', longitude: '80.9462' },
                  "Kanpur": { latitude: '26.4499', longitude: '80.3319' },
                  "Sitapur": { latitude: '27.5624', longitude: '80.6318' }
                },
                "Kanpur": {
                  "Kanpur": { latitude: '26.4499', longitude: '80.3319' },
                  "Unnao": { latitude: '26.5524', longitude: '80.5364' },
                  "Farrukhabad": { latitude: '27.3887', longitude: '79.5837' }
                },
                "Varanasi": {
                  "Varanasi": { latitude: '25.3176', longitude: '82.9739' },
                  "Jaunpur": { latitude: '25.7335', longitude: '82.6844' },
                  "Chandauli": { latitude: '25.2627', longitude: '83.0550' }
                },
                "Agra": {
                  "Agra": { latitude: '27.1767', longitude: '78.0081' },
                  "Firozabad": { latitude: '27.1540', longitude: '78.3875' },
                  "Etah": { latitude: '27.5537', longitude: '78.6570' }
                },
                "Meerut": {
                  "Meerut": { latitude: '28.9845', longitude: '77.7063' },
                  "Muzaffarnagar": { latitude: '29.4678', longitude: '77.6737' },
                  "Saharanpur": { latitude: '29.9678', longitude: '77.5457' }
                },
                "Allahabad": {
                  "Allahabad": { latitude: '25.4358', longitude: '81.8463' },
                  "Prayagraj": { latitude: '25.4358', longitude: '81.8463' },
                  "Kaushambi": { latitude: '25.5026', longitude: '81.5638' }
                },
                "Gorakhpur": {
                  "Gorakhpur": { latitude: '26.7606', longitude: '83.3732' },
                  "Deoria": { latitude: '26.4666', longitude: '83.7802' },
                  "Basti": { latitude: '26.7984', longitude: '82.6953' }
                }
              },
              "Uttarakhand": {
                "Dehradun": {
                  "Dehradun": { latitude: '30.3165', longitude: '78.0322' },
                  "Mussoorie": { latitude: '30.4594', longitude: '78.0752' },
                  "Haridwar": { latitude: '29.9457', longitude: '78.1642' }
                },
                "Haridwar": {
                  "Haridwar": { latitude: '29.9457', longitude: '78.1642' },
                  "Rishikesh": { latitude: '30.0869', longitude: '78.2676' },
                  "Roorkee": { latitude: '29.8546', longitude: '77.8884' }
                },
                "Nainital": {
                  "Nainital": { latitude: '29.3919', longitude: '79.4549' },
                  "Haldwani": { latitude: '29.2184', longitude: '79.5215' },
                  "Kathgodam": { latitude: '29.2233', longitude: '79.4877' }
                },
                "Almora": {
                  "Almora": { latitude: '29.5974', longitude: '79.6828' },
                  "Bageshwar": { latitude: '30.0607', longitude: '80.1714' },
                  "Pithoragarh": { latitude: '29.5921', longitude: '80.2232' }
                },
                "Udham Singh Nagar": {
                  "Udham Singh Nagar": { latitude: '28.9675', longitude: '79.4383' },
                  "Kashipur": { latitude: '29.1853', longitude: '78.9700' },
                  "Rudrapur": { latitude: '28.8325', longitude: '79.4601' }
                }
              },
              "West Bengal": {
                "Kolkata": {
                  "Kolkata": { latitude: '22.5726', longitude: '88.3639' },
                  "Howrah": { latitude: '22.5958', longitude: '88.2639' },
                  "Salt Lake": { latitude: '22.5837', longitude: '88.4171' }
                },
                "Howrah": {
                  "Howrah": { latitude: '22.5958', longitude: '88.2639' },
                  "Uluberia": { latitude: '22.3718', longitude: '88.2012' },
                  "Santragachi": { latitude: '22.5840', longitude: '88.2977' }
                },
                "Siliguri": {
                  "Siliguri": { latitude: '26.7274', longitude: '88.6126' },
                  "Jalpaiguri": { latitude: '26.5319', longitude: '88.7264' },
                  "Cooch Behar": { latitude: '26.2637', longitude: '89.4462' }
                },
                "Durgapur": {
                  "Durgapur": { latitude: '23.4900', longitude: '87.3095' },
                  "Asansol": { latitude: '23.6830', longitude: '86.9865' },
                  "Bankura": { latitude: '23.2340', longitude: '87.0682' }
                },
                "Kharagpur": {
                  "Kharagpur": { latitude: '22.3500', longitude: '87.3200' },
                  "Midnapore": { latitude: '22.4100', longitude: '87.3270' },
                  "Jhargram": { latitude: '22.4872', longitude: '86.9781' }
                },
                "Malda": {
                  "Malda": { latitude: '25.0121', longitude: '88.5890' },
                  "English Bazar": { latitude: '25.0778', longitude: '88.5982' },
                  "Chanchal": { latitude: '25.0732', longitude: '88.4345' }
                }
              }
           
            
         };

         const states = Object.keys(locations); 
         const districts = state ? Object.keys(locations[state]) : [];
         const cities = district ? locations[state][district] : [];
       
         const stateOptions = states.map(stateName => ({ value: stateName, label: stateName }));
         const districtOptions = districts.map(districtName => ({ value: districtName, label: districtName }));
         const cityOptions = cities.map(cityName => ({ value: cityName, label: cityName }));
       
         useEffect(() => {
           setDayNightBackground();
         }, []);
       
         useEffect(() => {
           if (city) {
             checkLocationValidity();
           }
         }, [city]);
       
         useEffect(() => {
           const handleClickOutside = (event) => {
             if (modalRef.current && !modalRef.current.contains(event.target)) {
               setIsModalOpen(false);
             }
             if (navRef.current && !navRef.current.contains(event.target)) {
               setIsNavOpen(false);
             }
           };
       
           if (isModalOpen) {
             document.addEventListener('mousedown', handleClickOutside);
           } else {
             document.removeEventListener('mousedown', handleClickOutside);
           }
       
           return () => {
             document.removeEventListener('mousedown', handleClickOutside);
           };
         }, [isModalOpen]);
       
         const checkLocationValidity = () => {
           setError(''); // Clear error if everything is valid
           return true;
         };
       
         const getWeather = async (city) => {
           const coord = coordinates[state]?.[district]?.[city];
           if (!coord) {
             setError("Invalid location selected.");
             return;
           }
       
           const { latitude, longitude } = coord;
       
           try {
             const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`);
             if (response.ok) {
               const data = await response.json();
               setWeather(data);
               setIsModalOpen(true);
             } else {
               setError("Failed to fetch weather data.");
             }
           } catch (error) {
             setError("refresh and try again!");
             window.alert("check your internet connection!")
           }
         };
       
         const getModalBackground = () => {
           if (weather && weather.current_weather) {
             const condition = weather.current_weather.weathercode; // Use the correct field name for weather code
         
             switch (condition) {
               case 0: // Clear sky
               case 1: // Mainly clear
               case 2: // Partly cloudy
                 return 'sunny-background';
         
               case 3: // Cloudy
               case 4: // Mostly cloudy
                 return 'cloudy-background';
         
               case 5: // Light rain showers
               case 6: // Moderate rain showers
               case 7: // Heavy rain showers
               case 8: // Light rain
               case 9: // Moderate rain
                 return 'rainy-background';
         
               case 10: // Thunderstorm with light rain
               case 11: // Thunderstorm with moderate rain
               case 12: // Thunderstorm with heavy rain
                 return 'thunderstorm-background';
         
               default:
                 return ''; // Default background if the condition is not recognized
             }
           }
           return ''; // Default background if weather or current_weather is not available
         };
       
         const toggleNav = () => setIsNavOpen(!isNavOpen);
         
       
         return (
          <Router>

            <div className={`app ${isNavOpen ? 'nav-open' : ''}`}>
              {/* <button className="nav-toggle" onClick={toggleNav}>
                {isNavOpen ? <FaTimes /> : <FaBars />}
              </button> */}
      
              <div className={`side-navbar ${isNavOpen ? 'open' : ''}`}>
              <span className="text"><b>Aura<r>Weather</r></b></span>

                <div className="nav-content">
                  <Link to="/" className="nav-item" title="Home">
                    
                  <span className="nav-text">Home</span>
                  </Link>
                  <Link to="/weather" className="nav-item" title="Weather">
                    
                <span className="nav-text">Weather</span>
                  </Link>
                  {/* <Link to="/ar-map" className="nav-item" title="AR Map">
                    <FaMapMarkedAlt />
                    {isNavOpen && <span className="nav-text">AR Map</span>}
                  </Link>
                  <Link to="/about" className="nav-item" title="About">
                    <FaInfoCircle />
                    {isNavOpen && <span className="nav-text">About</span>}
                  </Link> */}
                  <Link to="/contact" className="nav-item" title="Contact">
                  <span className="nav-text">Contact</span>
                  </Link>

                  <span className="nav-text"></span>
                  <span className="nav-text"></span>
                  {/* <Link to="/about" className="nav-item" title="About">
                    <FaMoon />
                  </Link>  */}

                
                </div>
              </div>
      
              <div className="main-content">
                <Switch>
                  <Route path="/" exact>
                    <div className="home">
                      <h1>WELCOME TO MY WEBSITE</h1>
                      <p>To find Weather, click on Weather in the Navigation Bar.</p>
                    </div>
                  </Route>
      
                  <Route path="/weather">
                    <div className="content">
                      <h3>Choose or type your place to know your weather:</h3>
      
                      <Select
                        className="state-dropdown"
                        options={stateOptions}
                        onChange={(option) => { setState(option.value); setDistrict(''); setCity(''); setError(''); }}
                        value={stateOptions.find(option => option.value === state)}
                        placeholder="Select a State"
                      />
      
                      <Select
                        className="district-dropdown"
                        options={districtOptions}
                        onChange={(option) => { setDistrict(option.value); setCity(''); setError(''); }}
                        value={districtOptions.find(option => option.value === district)}
                        placeholder="Select a District"
                        isDisabled={!state}
                      />
      
                      <Select
                        className="city-dropdown"
                        options={cityOptions}
                        onChange={(option) => { setCity(option.value); setError(''); }}
                        value={cityOptions.find(option => option.value === city)}
                        placeholder="Select a City"
                        isDisabled={!district}
                      />
      
                      {error && <p className="error">{error}</p>}
      
                      <button class="get-weather-btn" onClick={() => getWeather(city)}>Get Weather</button>
      
                      {isModalOpen && (
                        <div className={`modal ${getModalBackground()}`} ref={modalRef}>
                          <div className="modal-content">
                            {weather && weather.current_weather && (
                              <>
                                <h2>Weather in {city}</h2>
                                <p>Temperature: {weather.current_weather.temperature}°C</p>
                                <p>Humidity: {weather.hourly.relative_humidity_2m[0]}%</p>
                                <p>Wind Speed: {weather.current_weather.windspeed} m/s</p>
                              </>
                            )}
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>Close</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </Route>
      
                  


                  <Route path="/about">
                    <div className="about">
                      <h2>About Us</h2>
                      <p>This is a weather app to help you find weather information for your city.</p>
                    </div>
                  </Route>
      
                  <Route path="/contact">
                    <div className="contact">
                      <h2>Contact Us</h2>
                      <p>If you have any questions, feel free to reach out at contact@example.com.</p>
                      
                    </div>
                  </Route>
                </Switch>
              </div>
            </div>
          </Router>
        );
      }
      export default App;