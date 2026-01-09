import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { Link } from 'react-router-dom';

function MobileScrollBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const nav = [{name:'Products' , path: '/product'}, {name:'Quality Report' , path: '/quality_report'}, {name:'About' , path: '/about'}]

  return (
    <div className="revlative w-full md:hidden z-[100]">
      {/* Clickable bar */}
      <div
        className={`${menuOpen ? 'bg-green-700':'rounded-b-3xl bg-green-600'} shadow-md h-10 w-full flex items-center cursor-pointer px-5 text-white select-none`}
        onClick={toggleMenu}
      >
        {menuOpen ? (<div className='w-full flex justify-center text-sm'>X</div>) : 'Click to open Menu'}
      </div>

      {/* Expandable menu area */}
      {menuOpen && (
        <div className="absolute top-[124px] left-0 z-50 w-full bg-green-600 rounded-b-3xl mt-[-6px] p-4 space-y-4">
            {nav.map((item , index) => (
            <Link onClick={() => setMenuOpen(!menuOpen)} to={`${item.path}`} key={index} className="flex flex-row justify-between items-center">
                <h6 className="text-sm font-normal text-white">{item.name}</h6>
                <div className="pt-2">
                <ChevronRight size={16} color='white'/>
                </div>
            </Link>
            ))}
        </div>
        )}
    </div>
  );
}

export default MobileScrollBar;
