import React, { useRef, useState } from 'react'
import Style from './CustomInputs.module.css'
import { isNumeric, padWithLeadingZeros } from '~/utils/input'
import { isValid } from 'date-fns'
import { Calendar } from 'react-date-range'
import useTarget from '~/hooks/useTarget'
import { TimePicker } from 'react-time-picker-typescript'
import "react-time-picker-typescript/dist/style.css";
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { api } from '~/utils/api'
import { type CityData } from '~/utils/cities/queries'
import { Loading } from '../utils/Loading'

type DateSelectionProps = {
    date: Date
    setDate: React.Dispatch<React.SetStateAction<Date>>
    nextInputRef?: React.RefObject<HTMLInputElement>
}

export const DateSelection: React.FC<DateSelectionProps> = ({
    date,
    setDate,
    nextInputRef
}) => {

    const { isTarget: showCalendar, setIsTarget: setShowCalendar, ref: calendarRef } = useTarget(false)



    const [day, setDay] = useState<string>(padWithLeadingZeros(date.getDate(), 2))
    const dayRef = useRef<HTMLInputElement>(null)
    const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (!isNumeric(e.target.value)) return
        if (e.target.value.length === 2) {
            if (parseInt(e.target.value) > 31) {
                setDay('31')
                monthRef.current?.focus()
                return
            } else {
                setDay(e.target.value)
                monthRef.current?.focus()
                return
            }
        }
        setDay((e.target.value))
        return
    }

    const [month, setMonth] = useState<string>(padWithLeadingZeros((date.getMonth() + 1), 2))
    const monthRef = useRef<HTMLInputElement>(null)
    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isNumeric(e.target.value)) return
        if (e.target.value.length === 2) {
            if (parseInt(e.target.value) > 12) {
                setMonth('12')
                yearRef.current?.focus()
                return
            } else {
                setMonth(e.target.value)
                yearRef.current?.focus()
                return
            }
        }
        setMonth((e.target.value))

    }

    const [year, setYear] = useState<string>(padWithLeadingZeros(date.getFullYear(), 4))
    const yearRef = useRef<HTMLInputElement>(null)
    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isNumeric(e.target.value)) return
        if (e.target.value.length === 4) {
            const date = concatDate(day, month, e.target.value)
            if (isValid(date)) {
                setYear(e.target.value)
                yearRef.current?.blur()
                nextInputRef?.current?.focus()
                return
            } else {
                directlySetDate(new Date())
                dayRef.current?.focus()
                return
            }
        }
        setYear((e.target.value))
        return
    }

    const concatDate = (day: string, month: string, year: string) => {
        return new Date(`${padWithLeadingZeros(year, 4)}-${padWithLeadingZeros(month, 2)}-${padWithLeadingZeros(day, 2)}T12:00:00.000Z`)
    }

    const directlySetDate = (date: Date) => {
        if (!isValid(date)) {
            directlySetDate(new Date())
            return
        }
        setDay(padWithLeadingZeros(date.getDate(), 2))
        setMonth(padWithLeadingZeros((date.getMonth() + 1), 2))
        setYear(padWithLeadingZeros(date.getFullYear(), 4))
        setDate(date)
    }


    return (
        <div className={Style.inputWrapper}>
            <div className={Style.textInputContainer}>
                <input
                    type="text"
                    className={Style.textInputDay}
                    value={day}
                    onClick={(e) => e.currentTarget.select()}
                    onFocus={(e) => e.currentTarget.select()}
                    onBlur={(e) => directlySetDate(concatDate(e.currentTarget.value, month, year))}
                    onChange={handleDayChange}
                    maxLength={2}
                    ref={dayRef}
                />
                <p className={Style.textInputDivider}>
                    /
                </p>
                <input
                    type="text"
                    className={Style.textInput}
                    value={month}
                    onClick={(e) => e.currentTarget.select()}
                    onFocus={(e) => e.currentTarget.select()}
                    onBlur={(e) => directlySetDate(concatDate(day, e.currentTarget.value, year))}
                    onChange={handleMonthChange}
                    maxLength={2}
                    ref={monthRef}

                />
                <p className={Style.textInputDivider}>
                    /
                </p>
                <input
                    type="text"
                    className={Style.textInputYear}
                    value={year}
                    max={4}
                    onClick={(e) => e.currentTarget.select()}
                    onFocus={(e) => e.currentTarget.select()}
                    onBlur={(e) => directlySetDate(concatDate(day, month, e.currentTarget.value))}
                    onChange={handleYearChange}
                    maxLength={4}
                    ref={yearRef}
                />
                <div className={Style.inputIcon}
                    onClick={() => setShowCalendar(!showCalendar)}
                >
                    <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M18 15.75C16.7574 15.75 15.75 16.7574 15.75 18C15.75 19.2426 16.7574 20.25 18 20.25C19.2426 20.25 20.25 19.2426 20.25 18C20.25 16.7574 19.2426 15.75 18 15.75ZM14.25 18C14.25 15.9289 15.9289 14.25 18 14.25C20.0711 14.25 21.75 15.9289 21.75 18C21.75 18.7643 21.5213 19.4752 21.1287 20.068L22.5303 21.4697C22.8232 21.7626 22.8232 22.2374 22.5303 22.5303C22.2374 22.8232 21.7626 22.8232 21.4697 22.5303L20.068 21.1287C19.4752 21.5213 18.7643 21.75 18 21.75C15.9289 21.75 14.25 20.0711 14.25 18Z" fill="gray" />
                        <path d="M7.75 2.5C7.75 2.08579 7.41421 1.75 7 1.75C6.58579 1.75 6.25 2.08579 6.25 2.5V4.07926C4.81067 4.19451 3.86577 4.47737 3.17157 5.17157C2.47737 5.86577 2.19451 6.81067 2.07926 8.25H21.9207C21.8055 6.81067 21.5226 5.86577 20.8284 5.17157C20.1342 4.47737 19.1893 4.19451 17.75 4.07926V2.5C17.75 2.08579 17.4142 1.75 17 1.75C16.5858 1.75 16.25 2.08579 16.25 2.5V4.0129C15.5847 4 14.839 4 14 4H10C9.16097 4 8.41527 4 7.75 4.0129V2.5Z" fill="gray" />
                        <path d="M22 12V14C22 14.2053 22 14.405 21.9998 14.5992C21.0368 13.4677 19.6022 12.75 18 12.75C15.1005 12.75 12.75 15.1005 12.75 18C12.75 19.6022 13.4677 21.0368 14.5992 21.9998C14.405 22 14.2053 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12C2 11.161 2 10.4153 2.0129 9.75H21.9871C22 10.4153 22 11.161 22 12Z" fill="gray" />
                    </svg>
                </div>
            </div>
            {
                showCalendar &&
                <div className={Style.calendarContainer} ref={calendarRef}>
                    <Calendar
                        date={date}
                        onChange={(date) => {
                            directlySetDate(date)
                            setShowCalendar(false)
                        }}

                    />
                </div>
            }
        </div>
    )
}

type TimeSelectionProps = {
    time: string
    setTime: React.Dispatch<React.SetStateAction<string>>
    nextInputRef?: React.RefObject<HTMLInputElement>
    startRef?: React.RefObject<HTMLInputElement>
}

export const TimeSelection: React.FC<TimeSelectionProps> = ({
    time,
    setTime,
    nextInputRef,
    startRef
}) => {

    const [showPicker, setShowPicker] = useState(false)



    const [hours, setHours] = useState<string>("00")
    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.value === '') {
            setHours('00')
            concatAndSetTime('00', minutes)
            return
        }
        if (!isNumeric(e.target.value)) return
        if (e.target.value.length === 2) {
            if (parseInt(e.target.value) > 23) {
                setHours('23')
                concatAndSetTime('23', minutes)
                startRef.current?.blur()
                minutesRef.current?.focus()
                return
            } else {
                setHours(e.target.value)
                concatAndSetTime(e.target.value, minutes)
                minutesRef.current?.focus()
                return
            }
        }

        setHours((e.target.value))
        concatAndSetTime(e.target.value, minutes)
        return
    }

    const [minutes, setMinutes] = useState<string>("00")
    const minutesRef = useRef<HTMLInputElement>(null)
    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.value === '') {
            setMinutes('00')
            concatAndSetTime(hours, '00')
            return
        }
        if (!isNumeric(e.target.value)) return
        if (e.target.value.length === 2) {
            if (parseInt(e.target.value) > 59) {
                setMinutes('59')
                concatAndSetTime(hours, '59')
                nextInputRef?.current?.focus()
                return
            } else {
                setMinutes(e.target.value)
                concatAndSetTime(hours, e.target.value)
                nextInputRef?.current?.focus()
                return
            }
        }
        setMinutes(e.target.value)
        concatAndSetTime(hours, e.target.value)
        return

    }

    const concatAndSetTime = (hours: string, minutes: string) => {
        setTime(`${hours}:${minutes}`)
    }

    const directlySetTime = (time: string) => {
        const [hours, minutes] = time.split(':')
        setHours(padWithLeadingZeros(parseInt(hours), 2))
        setMinutes(padWithLeadingZeros(parseInt(minutes), 2))
        setTime(time)
    }

    const handleShowPicker = (current: boolean) => {

        if (!current) {
            setTimeout(() => {
                setShowPicker(prev => !prev)
            }, 10)

            setTimeout(() => {
                setShowPicker(prev => !prev)
            }, 20)

            setTimeout(() => {
                setShowPicker(prev => !prev)
            }, 30)

        } else {
            setTimeout(() => {
                setShowPicker(prev => !prev)
            }, 10)

            setTimeout(() => {
                setShowPicker(prev => !prev)
            }, 20)
        }
        // setShowPicker(prev => !prev)

    }


    return (
        <div className={Style.inputWrapper}>
            <div className={Style.timeInputContainer}>
                <input
                    type="text"
                    className={Style.timeInputDay}
                    value={hours}
                    onClick={(e) => e.currentTarget.select()}
                    onFocus={(e) => e.currentTarget.select()}
                    onBlur={(e) => { e.currentTarget.value.length < 2 ? setHours(padWithLeadingZeros(parseInt(e.currentTarget.value), 2)) : null }}
                    onChange={handleHoursChange}
                    maxLength={2}
                    ref={startRef}
                />
                <p className={Style.timeInputDivider}>
                    :
                </p>
                <input
                    type="text"
                    className={Style.timeInput}
                    value={minutes}
                    onClick={(e) => e.currentTarget.select()}
                    onFocus={(e) => e.currentTarget.select()}
                    onBlur={(e) => e.currentTarget.value.length === 1 ? setMinutes(padWithLeadingZeros(parseInt(e.currentTarget.value), 2)) : null}
                    onChange={handleMinutesChange}
                    maxLength={2}
                    ref={minutesRef}

                />
                <div className={Style.inputIcon}
                    onClick={() => handleShowPicker(showPicker)}
                >
                    <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23 12C23 12.3545 22.9832 12.7051 22.9504 13.051C22.3838 12.4841 21.7204 12.014 20.9871 11.6675C20.8122 6.85477 16.8555 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12C3.00683 16.8555 6.85477 20.8122 11.6675 20.9871C12.014 21.7204 12.4841 22.3838 13.051 22.9504C12.7051 22.9832 12.3545 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12Z" fill="gray" />
                        <path d="M13 11.8812L13.8426 12.3677C13.2847 12.7802 12.7902 13.2737 12.3766 13.8307L11.5174 13.3346C11.3437 13.2343 11.2115 13.0898 11.1267 12.9235C11 12.7274 11 12.4667 11 12.4667V6C11 5.44771 11.4477 5 12 5C12.5523 5 13 5.44772 13 6V11.8812Z" fill="gray" />
                        <path d="M18 15C17.4477 15 17 15.4477 17 16V17H16C15.4477 17 15 17.4477 15 18C15 18.5523 15.4477 19 16 19H17V20C17 20.5523 17.4477 21 18 21C18.5523 21 19 20.5523 19 20V19H20C20.5523 19 21 18.5523 21 18C21 17.4477 20.5523 17 20 17H19V16C19 15.4477 18.5523 15 18 15Z" fill="gray" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M18 24C21.3137 24 24 21.3137 24 18C24 14.6863 21.3137 12 18 12C14.6863 12 12 14.6863 12 18C12 21.3137 14.6863 24 18 24ZM18 22.0181C15.7809 22.0181 13.9819 20.2191 13.9819 18C13.9819 15.7809 15.7809 13.9819 18 13.9819C20.2191 13.9819 22.0181 15.7809 22.0181 18C22.0181 20.2191 20.2191 22.0181 18 22.0181Z" fill="gray" />
                    </svg>
                </div>
            </div>
            {
                showPicker &&
                <TimePicker
                    value={time}
                    onChange={(time) => {
                        directlySetTime(time)
                    }}
                    isOpen={true}
                    controllers={false}
                    inputClassName={Style.pickerInput}
                    popupClassName={Style.pickerPopup}

                />
            }
        </div>
    )
}




type CoordinatesSelectionProps = {
    decimalCord: { long: string; lat: string }
    setDecimalCord: React.Dispatch<React.SetStateAction<{ long: string; lat: string }>>
    latitude: { degrees: string; minutes: string; seconds: string }
    setLatitude: React.Dispatch<React.SetStateAction<{ degrees: string; minutes: string; seconds: string }>>
    longitude: { degrees: string; minutes: string; seconds: string }
    setLongitude: React.Dispatch<React.SetStateAction<{ degrees: string; minutes: string; seconds: string }>>
    setInputType: React.Dispatch<React.SetStateAction<"decimal" | "dms">>
    nextInputRef?: React.RefObject<HTMLInputElement>
    startRef?: React.RefObject<HTMLInputElement>
    setQueryCity: React.Dispatch<React.SetStateAction<CityData | null>>
}

export const CoordinatesSelection: React.FC<CoordinatesSelectionProps> = ({
    decimalCord,
    setDecimalCord,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
    setInputType,
    // nextInputRef,
    setQueryCity,
    startRef
}) => {

    const [locationType, setLocationType] = useState<"DMS" | "Decimal" | "City">("City");

    const handleLongitudeDecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const current = e.currentTarget.value
        if (e.currentTarget.value === "-") {
            setDecimalCord((prevValues) => ({ ...prevValues, long: "-" }));
            return
        }
        if (e.currentTarget.value === "") {
            setDecimalCord((prevValues) => ({ ...prevValues, long: "" }));
            return
        }
        if (!isNumeric(e.currentTarget.value) || e.currentTarget.value === ' ' || e.currentTarget.value.includes(',') || e.currentTarget.value.includes(' ')) {
            setDecimalCord((prevValues) => ({ ...prevValues, long: "0" }));
            return
        }

        const degreesValue = parseFloat(current);

        if (degreesValue > 180) {
            setDecimalCord((prevValues) => ({ ...prevValues, long: "180" }));
            return
        }
        if (degreesValue < -180) {
            setDecimalCord((prevValues) => ({ ...prevValues, long: "-180" }));
            return
        }
        setDecimalCord((prevValues) => ({ ...prevValues, long: current }));

    };

    const handleLatitudeDecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const current = e.currentTarget.value
        if (e.currentTarget.value === "-") {
            setDecimalCord((prevValues) => ({ ...prevValues, lat: "-" }));
            return
        }
        if (e.currentTarget.value === "") {
            setDecimalCord((prevValues) => ({ ...prevValues, lat: "" }));
            return
        }
        if (!isNumeric(e.currentTarget.value) || e.currentTarget.value === ' ' || e.currentTarget.value.includes(',') || e.currentTarget.value.includes(' ')) {
            setDecimalCord((prevValues) => ({ ...prevValues, lat: "0" }));
            return
        }

        const degreesValue = parseFloat(current);

        if (degreesValue > 180) {
            setDecimalCord((prevValues) => ({ ...prevValues, lat: "180" }));
            return
        }
        if (degreesValue < -180) {
            setDecimalCord((prevValues) => ({ ...prevValues, lat: "-180" }));
            return
        }
        setDecimalCord((prevValues) => ({ ...prevValues, lat: current }));
    };




    const handleLongitudeDegreesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.value === "-") {
            setLongitude((prevValues) => ({ ...prevValues, degrees: "-" }));
            return
        }
        if (e.currentTarget.value === "") {
            setLongitude((prevValues) => ({ ...prevValues, degrees: "" }));
            return
        }
        if (!isNumeric(e.currentTarget.value) || e.currentTarget.value === ' ' || e.currentTarget.value.includes('.') || e.currentTarget.value.includes(',') || e.currentTarget.value.includes(' ')) {
            setLongitude((prevValues) => ({ ...prevValues, degrees: "0" }));
            return
        }

        const degreesValue = parseFloat(e.currentTarget.value);

        if (degreesValue > 180) {
            setLongitude((prevValues) => ({ ...prevValues, degrees: "180" }));
            return
        }
        if (degreesValue < -180) {
            setLongitude((prevValues) => ({ ...prevValues, degrees: "-180" }));
            return
        }
        setLongitude((prevValues) => ({ ...prevValues, degrees: degreesValue.toString() }));
    };

    const handleLongitudeMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.value === "") {
            setLongitude((prevValues) => ({ ...prevValues, minutes: "" }));
            return
        }
        if (!isNumeric(e.currentTarget.value) || e.currentTarget.value === ' ' || e.currentTarget.value.includes('.') || e.currentTarget.value.includes(',') || e.currentTarget.value.includes(' ')) {
            setLongitude((prevValues) => ({ ...prevValues, minutes: "0" }));
            return
        }

        const minutesValue = parseFloat(e.currentTarget.value);

        if (minutesValue > 59) {
            setLongitude((prevValues) => ({ ...prevValues, minutes: "59" }));
            return
        }
        setLongitude((prevValues) => ({ ...prevValues, minutes: minutesValue.toString() }));
    };

    const handleLongitudeSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.value === "-") {
            setLongitude((prevValues) => ({ ...prevValues, seconds: "-" }));
            return
        }
        if (e.currentTarget.value === "") {
            setLongitude((prevValues) => ({ ...prevValues, seconds: "" }));
            return
        }
        if (!isNumeric(e.currentTarget.value) || e.currentTarget.value === ' ' || e.currentTarget.value.includes('.') || e.currentTarget.value.includes(',') || e.currentTarget.value.includes(' ')) {
            setLongitude((prevValues) => ({ ...prevValues, seconds: "0" }));
            return
        }

        const secondsValue = parseFloat(e.currentTarget.value);

        if (secondsValue > 59) {
            setLongitude((prevValues) => ({ ...prevValues, seconds: "59" }));
            return
        }
        setLongitude((prevValues) => ({ ...prevValues, seconds: secondsValue.toString() }));
    };

    const handleLatitudeDegreesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.value === "-") {
            setLatitude((prevValues) => ({ ...prevValues, degrees: "-" }));
            return
        }
        if (e.currentTarget.value === "") {
            setLatitude((prevValues) => ({ ...prevValues, degrees: "" }));
            return
        }
        if (!isNumeric(e.currentTarget.value) || e.currentTarget.value === ' ' || e.currentTarget.value.includes('.') || e.currentTarget.value.includes(',') || e.currentTarget.value.includes(' ')) {
            setLatitude((prevValues) => ({ ...prevValues, degrees: "0" }));
            return
        }

        const degreesValue = parseFloat(e.currentTarget.value);

        if (degreesValue > 180) {
            setLatitude((prevValues) => ({ ...prevValues, degrees: "180" }));
            return
        }
        if (degreesValue < -180) {
            setLatitude((prevValues) => ({ ...prevValues, degrees: "-180" }));
            return
        }
        setLatitude((prevValues) => ({ ...prevValues, degrees: degreesValue.toString() }));
    };

    const handleLatitudeMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.value === "") {
            setLatitude((prevValues) => ({ ...prevValues, minutes: "" }));
            return
        }
        if (!isNumeric(e.currentTarget.value) || e.currentTarget.value === ' ' || e.currentTarget.value.includes('.') || e.currentTarget.value.includes(',') || e.currentTarget.value.includes(' ')) {
            setLatitude((prevValues) => ({ ...prevValues, minutes: "0" }));
            return
        }

        const minutesValue = parseFloat(e.currentTarget.value);

        if (minutesValue > 59) {
            setLatitude((prevValues) => ({ ...prevValues, minutes: "59" }));
            return
        }
        setLatitude((prevValues) => ({ ...prevValues, minutes: minutesValue.toString() }));
    };

    const handleLatitudeSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.value === "") {
            setLatitude((prevValues) => ({ ...prevValues, seconds: "" }));
            return
        }
        if (!isNumeric(e.currentTarget.value) || e.currentTarget.value === ' ' || e.currentTarget.value.includes('.') || e.currentTarget.value.includes(',') || e.currentTarget.value.includes(' ')) {
            setLatitude((prevValues) => ({ ...prevValues, seconds: "0" }));
            return
        }

        const secondsValue = parseFloat(e.currentTarget.value);

        if (secondsValue > 59) {
            setLatitude((prevValues) => ({ ...prevValues, seconds: "59" }));
            return
        }
        setLatitude((prevValues) => ({ ...prevValues, seconds: secondsValue.toString() }));
    };

    const handleInputTypeChange = (type: "City" | "DMS" | "Decimal") => {

        if (type === "City") {
            setLocationType("City");
            setInputType("decimal");
            return
        }

        if (type === "DMS") {
            setLongitude({ degrees: "0", minutes: "0", seconds: "0" });
            setLatitude({ degrees: "0", minutes: "0", seconds: "0" });
            setLocationType("DMS");
            setInputType("dms");

        } else {
            setDecimalCord({ long: "0", lat: "0" });
            setLocationType("Decimal");
            setInputType("decimal");
        }
    };

    return (
        <div className={Style.coordContainer}>
            {
                locationType === "City"
                    ?
                    <CitySelection
                        setDecimalCord={setDecimalCord}
                        startRef={startRef}
                        setQueryCity={setQueryCity}
                    />
                    :
                    <div className={Style.coordInputs}>
                        <label htmlFor="longitude">Longitude:</label>
                        {locationType === "Decimal" ? (
                            <div className={Style.decInputBox}>
                                <input
                                    name="longitude"
                                    type="text"
                                    value={decimalCord.long}
                                    onClick={(e) => e.currentTarget.select()}
                                    onFocus={(e) => e.currentTarget.select()}
                                    onChange={handleLongitudeDecChange}
                                    className={Style.decInput}
                                    ref={!locationType ? startRef : null}
                                // placeholder='0'
                                />
                            </div>
                        ) : (
                            <div className={Style.dmsInputContainer}>
                                <div className={Style.dmsInputBox}>
                                    <input
                                        name="degrees"
                                        type="text"
                                        value={longitude.degrees}
                                        onClick={(e) => e.currentTarget.select()}
                                        onFocus={(e) => e.currentTarget.select()}
                                        onBlur={(e) => e.currentTarget.value === "" ? setLongitude((prevValues) => ({ ...prevValues, degrees: "0" })) : null}
                                        onChange={handleLongitudeDegreesChange}
                                        className={Style.dmsInput}
                                        ref={locationType ? startRef : null}
                                    />
                                </div>
                                <div className={Style.dmsInputBox}>
                                    <input
                                        name="minutes"
                                        type="text"
                                        value={longitude.minutes}
                                        min={0}
                                        max={59}
                                        onClick={(e) => e.currentTarget.select()}
                                        onFocus={(e) => e.currentTarget.select()}
                                        onChange={handleLongitudeMinutesChange}
                                        placeholder="'"
                                        className={Style.dmsInput}
                                    />
                                </div>
                                <div className={Style.dmsInputBox}>
                                    <input
                                        name="seconds"
                                        type="text"
                                        value={longitude.seconds}
                                        min={0}
                                        max={59}
                                        onClick={(e) => e.currentTarget.select()}
                                        onFocus={(e) => e.currentTarget.select()}
                                        onChange={handleLongitudeSecondsChange}
                                        placeholder='"'
                                        className={Style.dmsInput}
                                    />
                                </div>
                            </div>
                        )}
                        <label htmlFor="latitude">Latitude:</label>
                        {locationType === "Decimal" ? (
                            <div className={Style.decInputBox}>
                                <input
                                    name="latitude"
                                    type="text"
                                    value={decimalCord.lat}
                                    min={-90}
                                    max={90}
                                    onClick={(e) => e.currentTarget.select()}
                                    onFocus={(e) => e.currentTarget.select()}
                                    onChange={handleLatitudeDecChange}
                                    className={Style.decInput}

                                />
                            </div>
                        ) : (
                            <div className={Style.dmsInputContainer}>
                                <div className={Style.dmsInputBox}>
                                    <input
                                        name="degrees"
                                        type="text"
                                        value={latitude.degrees}
                                        min={-90}
                                        max={90}
                                        onClick={(e) => e.currentTarget.select()}
                                        onFocus={(e) => e.currentTarget.select()}
                                        onChange={handleLatitudeDegreesChange}
                                        className={Style.dmsInput}
                                        placeholder="°"
                                    />
                                </div>
                                <div className={Style.dmsInputBox}>
                                    <input
                                        name="minutes"
                                        type="text"
                                        value={latitude.minutes}
                                        min={0}
                                        max={59}
                                        onClick={(e) => e.currentTarget.select()}
                                        onFocus={(e) => e.currentTarget.select()}
                                        onChange={handleLatitudeMinutesChange}
                                        className={Style.dmsInput}
                                        placeholder="'"
                                    />
                                </div>
                                <div className={Style.dmsInputBox}>
                                    <input
                                        name="seconds"
                                        type="text"
                                        value={latitude.seconds}
                                        min={0}
                                        max={59}
                                        onClick={(e) => e.currentTarget.select()}
                                        onFocus={(e) => e.currentTarget.select()}
                                        onChange={handleLatitudeSecondsChange}
                                        className={Style.dmsInput}
                                        placeholder='"'
                                    />
                                </div>
                            </div>
                        )}
                    </div>
            }
            <div className={Style.coordType}>
                <div className={Style.coordTypeOptions}>
                    <div className={Style.coordTypeButton + ' ' + `${locationType === "Decimal" ? Style.coordTypeButtonActive : ''}`}
                        onClick={() => handleInputTypeChange("Decimal")}
                    ></div>
                    <p className={Style.coordTypeText}>
                        Decimal
                    </p>
                </div>
                <div className={Style.coordTypeOptions}>
                    <div className={Style.coordTypeButton + ' ' + `${locationType === "DMS" ? Style.coordTypeButtonActive : ''}`}
                        onClick={() => handleInputTypeChange("DMS")}
                    ></div>
                    <p className={Style.coordTypeText}>
                        {/* Degrees, Minutes,<br></br> Seconds (DMS) */}
                        DMS
                    </p>
                </div>
                <div className={Style.coordTypeOptions}>
                    <div className={Style.coordTypeButton + ' ' + `${locationType === "City" ? Style.coordTypeButtonActive : ''}`}
                        onClick={() => handleInputTypeChange("City")}
                    ></div>
                    <p className={Style.coordTypeText}>
                        City
                    </p>
                </div>
            </div>
        </div>
    )
}

type CitySelectionProps = {
    setDecimalCord: React.Dispatch<React.SetStateAction<{ long: string; lat: string }>>
    startRef?: React.RefObject<HTMLInputElement>
    setQueryCity: React.Dispatch<React.SetStateAction<CityData | null>>
}

export const CitySelection: React.FC<CitySelectionProps> = ({
    setDecimalCord,
    startRef,
    setQueryCity
}) => {
    const [country, setCountry] = useState<string>("")
    const queryCountry = api.chart.getCountries.useQuery({
        queryString: country
    }, {
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
            console.log(data)
        }
    });
    const [selectedCountry, setSelectedCountry] = useState<string>("")
    const [isCountryFocused, setIsCountryFocused] = useState<boolean>(false)

    const handleCountryBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.relatedTarget !== null) {
            if (e.relatedTarget.getAttribute('data-type') === 'country') return
            setIsCountryFocused(false)
        } else {
            setIsCountryFocused(false)
        }
    }

    const [city, setCity] = useState<string>("")
    const queryCity = api.chart.getCities.useQuery({
        queryString: city,
        country: selectedCountry
    }, {
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
            console.log(data)
        },
        enabled: !!selectedCountry
    });
    const [selectedCity, setSelectedCity] = useState<CityData | null>(null)
    const [isCityFocused, setIsCityFocused] = useState<boolean>(false)
    const cityRef = useRef<HTMLInputElement>(null)

    const handleSelectCity = (city: CityData) => {
        setSelectedCity(city)
        setQueryCity(city)
        setCity(city.city_ascii)
        setDecimalCord({ long: city.lng.toString(), lat: city.lat.toString() })
    }

    const handleCityBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.relatedTarget !== null) {
            if (e.relatedTarget.getAttribute('data-type') === 'city') return
            setIsCityFocused(false)
        } else {
            setIsCityFocused(false)
        }
    }

    return (
        <div className={Style.citySelectionContainer}>
            <div className={Style.countryContainer}
                onFocus={() => setIsCountryFocused(true)}
                onBlur={handleCountryBlur}
            >
                <input
                    type="text"
                    value={selectedCountry ? selectedCountry : country}
                    onChange={(e) => setCountry(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Backspace') {
                            console.log('Backspace')
                            setSelectedCountry('')
                        }
                    }}
                    ref={startRef}
                    className={Style.locationInput}
                    placeholder='Country'
                />
                <div className={Style.countryModal + ' ' + `${!!country && !selectedCountry && isCountryFocused ? Style.countryModalOpen : null}`}>
                    {
                        queryCountry.isLoading
                            ?
                            <Loading width={20} />
                            :
                            queryCountry.data?.map((country, idx) => {
                                return (
                                    <p
                                        key={`${country}-${idx}}`}
                                        onClick={() => { setSelectedCountry(country); setCountry(country) }}
                                        className={Style.countryModalOption}
                                        data-type='country'
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                setSelectedCountry(country)
                                                setCountry(country)
                                                cityRef.current?.focus()
                                            }
                                        }}
                                    >
                                        {country}
                                    </p>
                                )
                            })
                    }
                </div>

            </div>

            <div className={Style.countryContainer}
                onFocus={() => setIsCityFocused(true)}
                onBlur={handleCityBlur}
            >
                <input
                    type="text"
                    value={selectedCity ? selectedCity.city : city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Backspace') {
                            console.log('Backspace')
                            setSelectedCity(null)
                        }
                    }}
                    className={Style.locationInput}
                    placeholder='City'
                    onBlur={handleCityBlur}
                    ref={cityRef}
                />
                {
                    !!selectedCountry &&
                    <div className={Style.countryModal + ' ' + `${!!city && !selectedCity && isCityFocused ? Style.countryModalOpen : null}`}>
                        {
                            queryCity.isLoading
                                ?
                                <Loading width={20} />
                                :
                                queryCity.data?.slice(0, 50).map((city, idx) => {
                                    return (
                                        <p
                                            key={`${city.city}-${city.city_ascii}-${idx}}`}
                                            onClick={() => handleSelectCity(city)}
                                            className={Style.countryModalOption}
                                            data-type='city'
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault()
                                                    handleSelectCity(city)
                                                }
                                            }}

                                        >
                                            {city.city} ({city.admin_name}) ({city.lng} {city.lat})
                                        </p>
                                    )
                                })
                        }
                    </div>
                }

            </div>
        </div>
    )
}

type TimeZoneSelectionProps = {
    abv: string;
    gmt_offset: number;
    utcDateTime: Date;
}

export const TimeZoneSelection: React.FC<TimeZoneSelectionProps> = ({
    abv,
    gmt_offset,
    utcDateTime
}) => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const getDateString = (date: Date) => {
        const UTCTimeString = `${padWithLeadingZeros(date.getUTCHours(), 2)}:${padWithLeadingZeros(date.getUTCMinutes(), 2)}`
        const isDifferentDay = date.getDate() !== date.getUTCDate();
        console.log(isDifferentDay, date.getUTCDate(), date.getUTCDate())
        const UTCDayAndMonth = `${isDifferentDay ? `, ${date.getUTCDate()} ${months[date.getUTCMonth()]}` : ''}`
        return (
            <p className={Style.timezoneHour}>
                {UTCTimeString}<span className={Style.timezoneHourMini}>{UTCDayAndMonth}</span>
            </p>
        )
    }
    return (
        <div className={Style.timezoneContainer}>
            <p className={Style.timezoneAbv}>
                UTC{gmt_offset > 0 ? `+${gmt_offset}`: gmt_offset < 0 ? `-${Math.abs(gmt_offset)}`:'' } ({abv})
            </p>
            {getDateString(utcDateTime)}
        </div>
    )
}
