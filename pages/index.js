import Head from "next/head";
import { useCallback, useState } from "react";
import SearchBox from "../components/SearchBox";
import TodaysWeather from "../components/TodaysWeather";
import WeeklyWeather from "../components/WeeklyWeather";
import cities from "../lib/city.list.json";
import moment from "moment-timezone";

export default function Home() {
  const [city, setCity] = useState([]);
  const [wWeather, setWweather] = useState();
  const [hourly, setHourly] = useState();
  const [timeZone, setTimeZone] = useState();

  //taking value from search box
  const handleChange = (val) => {
    setCity(val);
  };
  //taking city from the dropdown shown
  const handleSelectCity = async (value) => {
    getServerSideProps(value);
  };
  //get city through city
  const getCityId = (param) => {
    const cityParam = param.trim();
    // get the id of the city
    const splitCity = cityParam.split("-");
    const id = splitCity[splitCity.length - 1];

    if (!id) {
      return null;
    }

    const city = cities.find((city) => city.id.toString() == id);

    if (city) {
      return city;
    } else {
      return null;
    }
  };
  const getHourlyWeather = (hourlyData, timezone) => {
    const endOfDay = moment().tz(timezone).endOf("day").valueOf();
    const eodTimeStamp = Math.floor(endOfDay / 1000);

    const todaysData = hourlyData.filter((data) => data.dt < eodTimeStamp);

    return todaysData;
  };

  //fetching data from api
  async function getServerSideProps(context) {
    const city = getCityId(context.slug);
    // console.log(city);
    if (!city) {
      return {
        notFound: true,
      };
    }

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${process.env.REACT_APP_API_KEY}&exclude=minutely&units=metric`
    );
    const data = await res.json();
    if (!data) {
      return {
        notFound: true,
      };
    }
    //getting weather hourly and weekly
    const hourlyWeather = getHourlyWeather(data.hourly, data.timezone);
    const weeklyWeather = data.daily;

    setWweather(weeklyWeather);
    setTimeout(() => {
      setHourly(hourlyWeather);
    }, 5);
    setTimeout(() => {
      setTimeZone(data.timezone);
    }, 5);
  }
  return (
    <div>
      <Head>
        <title>Weather Update </title>
      </Head>

      <div className="home">
        <div className="container">
          <h2 className="weather-title">Weather Update </h2>
          <SearchBox
            handleChange={handleChange}
            handleSelectCity={handleSelectCity}
            placeholder="Search for a city..."
          />
          {city && wWeather && timeZone && (
            <TodaysWeather
              city={city}
              weather={wWeather[0]}
              timezone={timeZone}
            />
          )}
          {wWeather && timeZone && (
            <WeeklyWeather weeklyWeather={wWeather} timezone={timeZone} />
          )}
        </div>
      </div>
    </div>
  );
}
