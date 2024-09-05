import { useState, useEffect } from 'react'
import Circle from './Circle';
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trafficLight, setTrafficLight] = useState([
    {
      color: 'bg-red-600',
      text: 'Win met3eddi ????',
      time: 3000,
      isCurrent: true,
    },
    {
      color: 'bg-yellow-500',
      text: 'Ken tnajem t3ada barra 3ala rou7ek',
      time: 2000,
      isCurrent: false,
    },
    {
      color: 'bg-green-700',
      text: 'barra endah',
      time: 3000,
      isCurrent: false,
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficLight(prevTrafficLight => {
        const newTrafficLight = prevTrafficLight.map((light, index) => ({
          ...light,
          isCurrent: index ===currentIndex,
        }));

        setCurrentIndex((currentIndex + 1) % trafficLight.length);

        return newTrafficLight;
      });
    }, trafficLight[currentIndex].time);

    return () => clearInterval(interval); 
  }, [currentIndex, trafficLight]);

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="flex flex-col justify-around items-center gap-2 bg-black p-4">
          {trafficLight.map((ele, index) => {
            return (
              <div key={index} className="w-60 h-60 rounded-full flex items-center justify-center bg-slate-100">
                <Circle color={ele.color}  isCurrent={ele.isCurrent} />
              </div>
            );
          })}
          <p className="text-white mt-4">
            {trafficLight.find(light => light.isCurrent)?.text}
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
