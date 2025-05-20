import Image from "next/image";
import ZodiacPlayer from "./components/ZodiacPlayer";
export default function Home() {
  return (
    <div className="">
      <div>
        <span>
          <p style={{color: "black"}}>Prototype: dates top out in 1990. So  if its not playing check that your dates are in range.
            </p>
            <ul>
                <label>needed for MVP:</label>
                <li>- more date data thats handled the data that is light and queriable</li>
                <li>- planets in motion / solar system animation</li>
                <li>- little popups to describe each placement breifly</li>
              </ul>          
              <ul>
                <br />
                <label>stretch goals</label>
                  
                  <li>-data that looks into various returns and retrogrades and events and then maps them onto the date range. use this to influence animation and fade (in a certain mode?)</li>
                  <li> -searchable time line</li>
                  <li>-log in & ability to compare sounds on dates with other users??</li>
                  <li>-maybe sell a little ad space?</li>
              </ul>
            
            
          </span>
        </div>
     <ZodiacPlayer />
    </div>
  );
}
