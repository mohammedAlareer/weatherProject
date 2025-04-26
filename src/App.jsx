import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import { useTranslation } from 'react-i18next';

function App() {
  const {t,i18n} = useTranslation();
  const [temp,setTemp] = useState({
    number:null,
    description:"",
    min:null,
    max:null,
    icon:"",
  });
  
  const [dateAndTime,setDateAndTime] = useState(null);

  const [locale,setLocale] = useState(i18n.language || "ar")

  const direction = locale =="ar" ?"rtl" :"ltr";

  function handleLanguageClick(){
    const newLocale = locale == "en" ? "ar" : "en"
    setLocale(newLocale);
    i18n.changeLanguage(newLocale);
    dayjs.locale(newLocale);
    setDateAndTime(dayjs().format('dddd D-MM-YYYY'))
  }

  useEffect(() => {
    const controller = new AbortController()
    dayjs.locale(locale);
    setDateAndTime(dayjs().format('dddd D-MM-YYYY'))
    async function getUser() {
      try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?lat=50.46&lon=37.79&appid=17e2b61ef6c84e2dac1884fefd11f26e',
          {
            signal:controller.signal,
          }
        );
        console.log(response)
        const responseTemp =Math.round( response.data.main.temp  - 273.15);
        const min = Math.round (response.data.main.temp_min - 273.15);
        const max = Math.round(response.data.main.temp_max - 273.15);
        const description = response.data.weather[0].description;
        const responseIcon = response.data.weather[0].icon;

        setTemp({number:responseTemp,min,max,description,icon:`https://openweathermap.org/img/wn/${responseIcon}@2x.png`})
      } catch (error) {
        console.log(error);
      }
    }
    getUser();
    
    return () =>{
      controller.abort();
    };
    
  },[])
  

  return (
    <>
      <div dir={direction} className='flex flex-col justify-center h-screen  items-center'>
        {/* Card */}
        <div className='bg-blue-900 text-white w-[480px] p-4 rounded-xl shadow-2xl shadow-black/50'>
          {/* Content */}
            <div>
              {/* City & Date */}
              <div className='flex items-end justify-start '>
                <h2 className='text-6xl  font-bold'>{t("Palestine")}</h2>
                <h6 className='mr-3 relative top-3'>{dateAndTime}</h6>
              </div>
              {/* City & Date */}
              <hr className='mt-4'/>
              {/* degree & details */}
              <div className='flex justify-between'>
              <div>
                {/*degree*/}
                  <div className='flex justify-center'>
                    <h1 className='text-8xl mr-2'>{temp.number}<span className='text-2xl relative bottom-10'>°</span></h1>
                    {/*TODO: degree image api*/}
                      <img src={temp.icon} className='mr-2' alt="Weather Icon"/>
                  </div>
                {/*Temp*/}

                  {/*details*/}
                <h1 className=' text-lg mr-6 '>{t(temp.description)}</h1>
                <div className='flex gap-2 mt-3 mr-4'>
                  <h6>{t("min")}:{temp.min}</h6>
                  |
                  <h6>{t("max")}:{temp.max}</h6>
                </div>
                {/*details*/}        
                </div>

                <div>
                <svg
                className='w-48 h-40 '
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" >
                <path d="M17.5 19a4.5 4.5 0 0 0 0-9 5.5 5.5 0 0 0-10.3-2.6A4.5 4.5 0 0 0 6.5 19z"/>
                  </svg>  
                </div>
                </div>
              {/* degree & details */}
            </div>
            {/* Content */}
        </div>
        {/* Card */}
        <div className="mt-4 flex justify-end">
    <button onClick={handleLanguageClick}
    className="bg-orange-600 text-white px-4 py-2 rounded-xl shadow hover:bg-orange-500 transition-all duration-300 ease-in-out">
      {t("English")}
    </button>
  </div>
      </div>
    </>
  )
}
export default App
