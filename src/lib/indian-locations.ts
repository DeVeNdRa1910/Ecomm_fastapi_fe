// Indian States and Cities Data
export const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const

export type IndianState = typeof indianStates[number]

export const stateCities: Record<IndianState, string[]> = {
  "Andhra Pradesh": [
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Nellore",
    "Kurnool",
    "Rajahmundry",
    "Kakinada",
    "Tirupati",
    "Anantapur",
    "Kadapa",
  ],
  "Arunachal Pradesh": [
    "Itanagar",
    "Naharlagun",
    "Tawang",
    "Bomdila",
    "Pasighat",
    "Tezu",
    "Ziro",
    "Along",
    "Daporijo",
    "Namsai",
  ],
  "Assam": [
    "Guwahati",
    "Silchar",
    "Dibrugarh",
    "Jorhat",
    "Nagaon",
    "Tinsukia",
    "Tezpur",
    "Bongaigaon",
    "Dhubri",
    "Sivasagar",
  ],
  "Bihar": [
    "Patna",
    "Gaya",
    "Bhagalpur",
    "Muzaffarpur",
    "Darbhanga",
    "Purnia",
    "Bihar Sharif",
    "Arrah",
    "Begusarai",
    "Katihar",
  ],
  "Chhattisgarh": [
    "Raipur",
    "Bhilai",
    "Bilaspur",
    "Korba",
    "Durg",
    "Rajnandgaon",
    "Raigarh",
    "Jagdalpur",
    "Ambikapur",
    "Dhamtari",
  ],
  "Goa": [
    "Panaji",
    "Margao",
    "Vasco da Gama",
    "Mapusa",
    "Ponda",
    "Bicholim",
    "Curchorem",
    "Valpoi",
    "Canacona",
    "Sanguem",
  ],
  "Gujarat": [
    "Ahmedabad",
    "Surat",
    "Vadodara",
    "Rajkot",
    "Bhavnagar",
    "Jamnagar",
    "Gandhinagar",
    "Junagadh",
    "Gandhidham",
    "Anand",
  ],
  "Haryana": [
    "Faridabad",
    "Gurgaon",
    "Panipat",
    "Ambala",
    "Yamunanagar",
    "Rohtak",
    "Hisar",
    "Karnal",
    "Sonipat",
    "Panchkula",
  ],
  "Himachal Pradesh": [
    "Shimla",
    "Mandi",
    "Solan",
    "Dharamshala",
    "Bilaspur",
    "Kullu",
    "Chamba",
    "Una",
    "Hamirpur",
    "Nahan",
  ],
  "Jharkhand": [
    "Ranchi",
    "Jamshedpur",
    "Dhanbad",
    "Bokaro Steel City",
    "Hazaribagh",
    "Deoghar",
    "Giridih",
    "Phusro",
    "Adityapur",
    "Chatra",
  ],
  "Karnataka": [
    "Bangalore",
    "Mysore",
    "Hubli",
    "Mangalore",
    "Belgaum",
    "Gulbarga",
    "Davangere",
    "Bellary",
    "Bijapur",
    "Shimoga",
  ],
  "Kerala": [
    "Kochi",
    "Thiruvananthapuram",
    "Kozhikode",
    "Thrissur",
    "Malappuram",
    "Kannur",
    "Kollam",
    "Alappuzha",
    "Palakkad",
    "Kottayam",
  ],
  "Madhya Pradesh": [
    "Indore",
    "Bhopal",
    "Gwalior",
    "Jabalpur",
    "Ujjain",
    "Raipur",
    "Satna",
    "Ratlam",
    "Rewa",
    "Murwara",
  ],
  "Maharashtra": [
    "Mumbai",
    "Pune",
    "Nagpur",
    "Thane",
    "Nashik",
    "Aurangabad",
    "Solapur",
    "Amravati",
    "Kolhapur",
    "Sangli",
  ],
  "Manipur": [
    "Imphal",
    "Thoubal",
    "Kakching",
    "Ukhrul",
    "Churachandpur",
    "Bishnupur",
    "Tamenglong",
    "Senapati",
    "Chandel",
    "Jiribam",
  ],
  "Meghalaya": [
    "Shillong",
    "Tura",
    "Jowai",
    "Nongpoh",
    "Baghmara",
    "Nongstoin",
    "Williamnagar",
    "Resubelpara",
    "Mairang",
    "Mawkyrwat",
  ],
  "Mizoram": [
    "Aizawl",
    "Lunglei",
    "Saiha",
    "Champhai",
    "Kolasib",
    "Serchhip",
    "Lawngtlai",
    "Mamit",
    "Khawzawl",
    "Hnahthial",
  ],
  "Nagaland": [
    "Kohima",
    "Dimapur",
    "Mokokchung",
    "Tuensang",
    "Wokha",
    "Zunheboto",
    "Mon",
    "Phek",
    "Kiphire",
    "Longleng",
  ],
  "Odisha": [
    "Bhubaneswar",
    "Cuttack",
    "Rourkela",
    "Berhampur",
    "Sambalpur",
    "Puri",
    "Baleshwar",
    "Bhadrak",
    "Baripada",
    "Balangir",
  ],
  "Punjab": [
    "Ludhiana",
    "Amritsar",
    "Jalandhar",
    "Patiala",
    "Bathinda",
    "Pathankot",
    "Hoshiarpur",
    "Batala",
    "Moga",
    "Abohar",
  ],
  "Rajasthan": [
    "Jaipur",
    "Jodhpur",
    "Kota",
    "Bikaner",
    "Ajmer",
    "Udaipur",
    "Bhilwara",
    "Alwar",
    "Bharatpur",
    "Sikar",
  ],
  "Sikkim": [
    "Gangtok",
    "Namchi",
    "Mangan",
    "Gyalshing",
    "Singtam",
    "Rangpo",
    "Jorethang",
    "Ravangla",
    "Pakyong",
    "Soreng",
  ],
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
    "Tirunelveli",
    "Erode",
    "Vellore",
    "Dindigul",
    "Thanjavur",
  ],
  "Telangana": [
    "Hyderabad",
    "Warangal",
    "Nizamabad",
    "Karimnagar",
    "Ramagundam",
    "Khammam",
    "Mahbubnagar",
    "Nalgonda",
    "Adilabad",
    "Siddipet",
  ],
  "Tripura": [
    "Agartala",
    "Udaipur",
    "Dharmanagar",
    "Kailasahar",
    "Belonia",
    "Khowai",
    "Ambassa",
    "Sabroom",
    "Teliamura",
    "Amarpur",
  ],
  "Uttar Pradesh": [
    "Lucknow",
    "Kanpur",
    "Agra",
    "Varanasi",
    "Allahabad",
    "Meerut",
    "Ghaziabad",
    "Noida",
    "Bareilly",
    "Aligarh",
  ],
  "Uttarakhand": [
    "Dehradun",
    "Haridwar",
    "Roorkee",
    "Haldwani",
    "Rudrapur",
    "Kashipur",
    "Rishikesh",
    "Ramnagar",
    "Pithoragarh",
    "Manglaur",
  ],
  "West Bengal": [
    "Kolkata",
    "Howrah",
    "Durgapur",
    "Asansol",
    "Siliguri",
    "Bardhaman",
    "Malda",
    "Kharagpur",
    "Jalpaiguri",
    "Baharampur",
  ],
  "Andaman and Nicobar Islands": [
    "Port Blair",
    "Diglipur",
    "Mayabunder",
    "Rangat",
    "Car Nicobar",
    "Hut Bay",
    "Bamboo Flat",
    "Garacharma",
    "Ferrargunj",
    "Wandoor",
  ],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": [
    "Daman",
    "Diu",
    "Silvassa",
    "Naroli",
    "Amli",
    "Kadaiya",
    "Khanvel",
    "Dadra",
    "Masat",
    "Rakholi",
  ],
  "Delhi": [
    "New Delhi",
    "Delhi",
    "North Delhi",
    "South Delhi",
    "East Delhi",
    "West Delhi",
    "Central Delhi",
    "Noida",
    "Gurgaon",
    "Faridabad",
  ],
  "Jammu and Kashmir": [
    "Srinagar",
    "Jammu",
    "Anantnag",
    "Baramulla",
    "Sopore",
    "Kathua",
    "Udhampur",
    "Rajouri",
    "Poonch",
    "Kupwara",
  ],
  "Ladakh": [
    "Leh",
    "Kargil",
    "Nubra",
    "Zanskar",
    "Drass",
    "Nyoma",
    "Diskit",
    "Hemis",
    "Alchi",
    "Thiksey",
  ],
  "Lakshadweep": [
    "Kavaratti",
    "Agatti",
    "Amini",
    "Andrott",
    "Bitra",
    "Chetlat",
    "Kadmat",
    "Kalpeni",
    "Kiltan",
    "Minicoy",
  ],
  "Puducherry": [
    "Puducherry",
    "Karaikal",
    "Mahe",
    "Yanam",
    "Ozhukarai",
    "Villianur",
    "Bahour",
    "Nettapakkam",
    "Ariyankuppam",
    "Mannadipet",
  ],
}

// Pincode to State/City mapping (sample data for common pincodes)
export const pincodeData: Record<
  string,
  { state: IndianState; city: string }
> = {
  // Maharashtra
  "400001": { state: "Maharashtra", city: "Mumbai" },
  "400002": { state: "Maharashtra", city: "Mumbai" },
  "411001": { state: "Maharashtra", city: "Pune" },
  "411002": { state: "Maharashtra", city: "Pune" },
  "440001": { state: "Maharashtra", city: "Nagpur" },
  "400601": { state: "Maharashtra", city: "Thane" },
  // Delhi
  "110001": { state: "Delhi", city: "New Delhi" },
  "110002": { state: "Delhi", city: "New Delhi" },
  "110003": { state: "Delhi", city: "New Delhi" },
  // Karnataka
  "560001": { state: "Karnataka", city: "Bangalore" },
  "560002": { state: "Karnataka", city: "Bangalore" },
  "570001": { state: "Karnataka", city: "Mysore" },
  // Tamil Nadu
  "600001": { state: "Tamil Nadu", city: "Chennai" },
  "600002": { state: "Tamil Nadu", city: "Chennai" },
  "641001": { state: "Tamil Nadu", city: "Coimbatore" },
  // West Bengal
  "700001": { state: "West Bengal", city: "Kolkata" },
  "700002": { state: "West Bengal", city: "Kolkata" },
  // Gujarat
  "380001": { state: "Gujarat", city: "Ahmedabad" },
  "380002": { state: "Gujarat", city: "Ahmedabad" },
  "395001": { state: "Gujarat", city: "Surat" },
  // Uttar Pradesh
  "226001": { state: "Uttar Pradesh", city: "Lucknow" },
  "208001": { state: "Uttar Pradesh", city: "Kanpur" },
  "282001": { state: "Uttar Pradesh", city: "Agra" },
  // Rajasthan
  "302001": { state: "Rajasthan", city: "Jaipur" },
  "342001": { state: "Rajasthan", city: "Jodhpur" },
  // Telangana
  "500001": { state: "Telangana", city: "Hyderabad" },
  "500002": { state: "Telangana", city: "Hyderabad" },
  // Andhra Pradesh
  "530001": { state: "Andhra Pradesh", city: "Visakhapatnam" },
  "520001": { state: "Andhra Pradesh", city: "Vijayawada" },
  // Kerala
  "682001": { state: "Kerala", city: "Kochi" },
  "695001": { state: "Kerala", city: "Thiruvananthapuram" },
  // Punjab
  "141001": { state: "Punjab", city: "Ludhiana" },
  "143001": { state: "Punjab", city: "Amritsar" },
  // Haryana
  "121001": { state: "Haryana", city: "Faridabad" },
  "122001": { state: "Haryana", city: "Gurgaon" },
  // Madhya Pradesh
  "452001": { state: "Madhya Pradesh", city: "Indore" },
  "462001": { state: "Madhya Pradesh", city: "Bhopal" },
  // Odisha
  "751001": { state: "Odisha", city: "Bhubaneswar" },
  "753001": { state: "Odisha", city: "Cuttack" },
  // Bihar
  "800001": { state: "Bihar", city: "Patna" },
  "823001": { state: "Bihar", city: "Gaya" },
  // Jharkhand
  "834001": { state: "Jharkhand", city: "Ranchi" },
  "831001": { state: "Jharkhand", city: "Jamshedpur" },
  // Assam
  "781001": { state: "Assam", city: "Guwahati" },
  "788001": { state: "Assam", city: "Silchar" },
  // Chhattisgarh
  "492001": { state: "Chhattisgarh", city: "Raipur" },
  "490001": { state: "Chhattisgarh", city: "Bhilai" },
  // Uttarakhand
  "248001": { state: "Uttarakhand", city: "Dehradun" },
  "249401": { state: "Uttarakhand", city: "Haridwar" },
  // Himachal Pradesh
  "171001": { state: "Himachal Pradesh", city: "Shimla" },
  "175001": { state: "Himachal Pradesh", city: "Mandi" },
  // Goa
  "403001": { state: "Goa", city: "Panaji" },
  "403601": { state: "Goa", city: "Margao" },
}

export function getLocationByPincode(
  pincode: string
): { state: IndianState; city: string } | null {
  return pincodeData[pincode] || null
}

// API-based pincode lookup
export async function getLocationByPincodeAPI(
  pincode: string
): Promise<{ state: IndianState; city: string } | null> {
  try {
    // First try local data
    const localData = getLocationByPincode(pincode)
    if (localData) {
      return localData
    }

    // If not found locally, try API
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`)
    if (!response.ok) {
      return null
    }

    const data = await response.json()
    if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
      const postOffice = data[0].PostOffice[0]
      const state = postOffice.State as string
      const city = postOffice.District || postOffice.Name || postOffice.Block || ""

      // Find matching state from our list (case-insensitive and handle variations)
      const normalizeState = (stateName: string) => {
        return stateName.toLowerCase().trim().replace(/\s+/g, " ")
      }

      const matchingState = indianStates.find((s) => {
        const normalizedApiState = normalizeState(state)
        const normalizedListState = normalizeState(s)
        return normalizedApiState === normalizedListState || 
               normalizedApiState.includes(normalizedListState) ||
               normalizedListState.includes(normalizedApiState)
      }) as IndianState | undefined

      if (matchingState && city) {
        return { state: matchingState, city: city.trim() }
      }
    }

    return null
  } catch (error) {
    console.error("Error fetching pincode data:", error)
    return null
  }
}

export function getCitiesByState(state: IndianState): string[] {
  return stateCities[state] || []
}

