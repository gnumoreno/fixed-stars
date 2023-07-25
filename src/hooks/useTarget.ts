import { useState, useEffect, useRef } from 'react';

const useTarget = (initialIsTarget: boolean) => {

    const [isTarget, setIsTarget] = useState(initialIsTarget);

    const ref = useRef(null);

    const handleClickOutside = (event: Event) => {
        
        if (ref.current && !ref.current.contains(event.target)) { //eslint-disable-line
            setIsTarget(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    return { ref, isTarget, setIsTarget };
}

export default useTarget;