import axios from "axios"
import {  z } from 'zod'
/*import { object, string, number, Output, parse } from 'valibot'*/
import { SearchType } from "../types"
import { useMemo, useState } from "react"


/*function isWeatherResponse(weather : unknown) : weather is Weather {
    return (
        Boolean(weather) && 
        typeof weather === 'object' && 
        typeof (weather as Weather).name === 'string' &&
        typeof (weather as Weather).main.temp === 'number' &&
        typeof (weather as Weather).main.temp_max === 'number' &&
        typeof (weather as Weather).main.temp_min === 'number'


    )
}*/

/*

// valibot

const WeatherSchema = object({
    name: string(),
    main: object({
        temp: number(),
        temp_max: number(),
        temp_min: number()
    })
})

type Weather = Output<typeof WeatherSchema>*/

const initialState = {
    name: '',
    main: {
        temp: 0,
        temp_max: 0,
        temp_min: 0
    }
    
}


//zod

const Weather = z.object({
    name: z.string(),
    main: z.object({
        temp: z.number(),
        temp_max: z.number(),
        temp_min: z.number()
    })
})

export type Weather = z.infer<typeof Weather>





export default function useWeather() {

    const [weather, setWeather] = useState(initialState)

     const [ loading, setLoading] = useState(false)

     const [notFound, setNotFound] = useState(false)


    const fetchWeather = async (search : SearchType) => {

        const appId = import.meta.env.VITE_API_KEY
        setLoading(true)
        setWeather(initialState)

        try {

            const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&
            &appid=${appId}`

            const {data} = await axios(geoUrl)

            //Coprobar si existe

            if(!data[0]){
                setNotFound(true)
                return;
            }else {
                setNotFound(false)
                
            }

                      
                const lat = data[0].lat
                const lon = data[0].lon


            const weattherUrl =`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}
            `
            //costaer el type
            /*const {data: weattherResult} = await axios<weather>(weattherUrl)

            console.log(weattherResult.name)*/

            /*// type Guardado
            const {data: weattherResult} = await axios(weattherUrl)
            const result = isWeatherResponse(weattherResult)
            if(result) {
                console.log(weattherResult.main)
            }*/

             /*

            //Valibot

            const {data: weattherResult} = await axios(weattherUrl)
            const result = parse(WeatherSchema, weattherResult)
            console.log(result)
            */

            
            // Zod

            const {data: weattherResult} = await axios(weattherUrl)
            const result = Weather.safeParse(weattherResult)
           if(result.success){
             setWeather(result.data)
           }

        } catch (error) {
            console.log(error)
        }finally {
            setLoading(false)
            
        }

    }

    
    const hasWeatherData = useMemo( () => weather.name, [weather])

    return {
        weather,
        loading,
        notFound,
        fetchWeather,
        hasWeatherData,
        
    }
}