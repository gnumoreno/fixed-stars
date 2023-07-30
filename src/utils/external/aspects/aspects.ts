import {  signFromPos, Signs } from "~/utils/astroCalc";
import { type planet } from "../planets/types";
import type { astro, aspect } from "./types";
import type { arabicPart } from "../arabicParts/types";
import type { house } from "../houses/types";
import type { star } from "../stars/types";


function isCorrectSign(typeOfAspect: makesAspectResponse, astroSign1: string, astroSign2: string) {
    let aspectJump: number;
    switch (typeOfAspect) {
        case 'conjunction':
            aspectJump = 0;
            break;
        case 'sextile':
            aspectJump = 2;
            break;
        case 'square': 
            aspectJump = 3;
            break;
        case 'trine':
            aspectJump = 4;
            break;
        case 'opposition':
            aspectJump = 6;
            break;
            default:
                console.log('you are dumb and dont know how to code: aspectJump:', aspectJump)
    }
    if(aspectJump === undefined) {
        console.log('aspect jump is undefined', typeOfAspect);
        return false;
    }
    const signIndex = Signs.findIndex((sign) =>{
        return sign.sign === astroSign1
        });
        if(signIndex === -1) {
            console.log('idiot, signIndex:', signIndex)
        }
    const nextSign = Signs[(signIndex + aspectJump) % 12];
    const previousSign = Signs[(signIndex - aspectJump + 12 ) % 12];
    const signArray = [nextSign.sign, previousSign.sign];
    return signArray.includes(astroSign2);
}
type makesAspectResponse = 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition' | undefined;
function makesAspect(posA: number, posB: number, orb: number): makesAspectResponse {
    const angle = Math.abs(posA - posB);
        if (angle >= (0 - orb) && angle < (0 + orb)) {
            return 'conjunction';
        } else if (angle >= (60 - orb) && angle < (60 + orb)) {
            return 'sextile';
        } else if (angle >= (90 - orb) && angle < (90 + orb)) {
            return 'square';
        } else if (angle >= (120 - orb) && angle < (120 + orb)) {
            return 'trine';
        } else if (angle >= (180 - orb) && angle < (180 + orb)) {
            return 'opposition';
        } else {
            return undefined;
        }
    }

function isValidAspect(astroA: astro, astroB: astro) {
        
            const astroTypePair = [astroA.astrotype, astroB.astrotype];
            if(
                astroTypePair.every((el) => el === 'house')
                ||
                astroTypePair.every((el) => el === 'star')
                ||
                astroTypePair.includes('star') && astroTypePair.includes('arabicPart')
                ||
                astroTypePair.includes('star') && astroTypePair.includes('antiscia')
                ) {
                return {
                    valid: false,
                    aspectType: undefined,
                };
            }
            const chosenOrb = astroA.orb > astroB.orb ? astroB.orb : astroA.orb;
            const aspectType = makesAspect(astroA.position, astroB.position, chosenOrb);

            if(!aspectType) {

                return {
                    valid: false,
                    aspectType: undefined,
                };
            }
            const signPosA = signFromPos(astroA.position).sign;
            const signPosB = signFromPos(astroB.position).sign;
            if( !isCorrectSign(aspectType, signPosA, signPosB) ) {
                
                return {
                    valid: false,
                    aspectType: undefined,
                };
            }
           
            if(aspectType === 'conjunction') {
                return {
                    valid: true,
                    aspectType: aspectType,
                };
            }
            
            if(astroA.astrotype === 'planet' && astroB.astrotype === 'planet') {
                return {
                    valid: true,
                    aspectType: aspectType,
                };
            } else {
                return {
                    valid: false,
                    aspectType: undefined,
                };
            }
            
        
}
  
export function getAstroTable(planets: planet[], houses: house[], stars: star[], arabicPart: arabicPart[]) {
    const astroTable: astro[] = [];
    planets.forEach((planet) => {
        const astrotypeName = planet.name === 'true Node' ? 'star' : 'planet'
        astroTable.push({
            astrotype: astrotypeName,
            astroname: planet.name,
            position: planet.position,
            angle: planet.angle,
            orb: planet.orb,
        })
    }); 
    houses.forEach((house) => {
        astroTable.push({
            astrotype: "house",
            astroname: house.name,
            position: house.position,
            angle: house.angle,
            orb: house.orb,
        })
    });
    stars.forEach((star) => {
        astroTable.push({
            astrotype: "star",
            astroname: star.name,
            position: star.position,
            angle: star.angle,
            orb: star.orb,
        })
    });

    arabicPart.forEach((part) => {
        astroTable.push({
            astrotype: "arabicPart",
            astroname: part.name,
            position: part.position,
            angle: part.angle,
            orb: part.orb,
        })
    });

    // TO DO: add antiscia

    return astroTable;
}


export function getAspects(astroTable: astro[]) {
    const aspects: aspect[] = [];
    for (let i = 0; i < astroTable.length; i++) {
        for (let j = i + 1; j < astroTable.length; j++) {
            const astroA = astroTable[i];
            const astroB = astroTable[j];
            if (astroA.astroname == astroB.astroname && astroA.astrotype == astroB.astrotype) {
            } else {
                const { valid, aspectType } = isValidAspect(astroA, astroB);
                if(valid) {
                        aspects.push({
                            astrotypeA: astroA.astrotype,
                            astronameA: astroA.astroname,
                            positionA: astroA.position,
                            angleA: astroA.angle,
                            typeOfAspect: aspectType,
                            astrotypeB: astroB.astrotype,
                            astronameB: astroB.astroname,
                            positionB: astroB.position,
                            angleB: astroB.angle,
                        })
                }

            }
        }
    }
    return aspects;
}

