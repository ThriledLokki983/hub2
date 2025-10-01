// import { useState } from 'react'
import { useEffect, useRef, useState } from 'react';
import './App.css'
// import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectDemo() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}



function App() {
  // const [count, setCount] = useState(0)
  const [expanded, setExpanded] = useState<boolean>(false);
  const popupButtonsRef = useRef<HTMLUListElement | null>(null);
  const splitButtonsRef = useRef<HTMLButtonElement | null>(null);

    // Effect to add event listeners for popup buttons
    useEffect(() => {
      // Keyup event handler for 'Escape' key
      const handleKeyup = (e: KeyboardEvent) => {
        if (e.code === 'Escape') {
          if (e.target instanceof HTMLElement) {
            e.target.blur();
          }
        }
      };

      // Focus and blur event handlers for managing aria-expanded
      const handleFocusIn = (e: FocusEvent) => {
        (e.currentTarget as HTMLElement).setAttribute('aria-expanded', 'true');
      };

      const handleFocusOut = (e: FocusEvent) => {
        (e.currentTarget as HTMLElement).setAttribute('aria-expanded', 'false');
      };

      splitButtonsRef.current?.addEventListener('click', (event) => {
        if (!event.target || (event.target as HTMLElement).nodeName !== 'BUTTON') return
          console.info((event.target as HTMLElement).innerText)
      });

      popupButtonsRef.current?.addEventListener('keyup', handleKeyup);
      popupButtonsRef.current?.addEventListener('focusin', handleFocusIn);
      popupButtonsRef.current?.addEventListener('focusout', handleFocusOut);

      // Cleanup event listeners on component unmount
      return () => {
        popupButtonsRef.current?.removeEventListener('keyup', handleKeyup);
        popupButtonsRef.current?.removeEventListener('focusin', handleFocusIn);
        popupButtonsRef.current?.removeEventListener('focusout', handleFocusOut);
      };
    }, []);



  return (
    <>
      <div className="gui-split-button" ref={splitButtonsRef}>
        <button >View Cart</button>
        <span ref={popupButtonsRef}  className="gui-popup-button" aria-haspopup="true" aria-expanded="false" title="Open for more actions">
          <svg aria-hidden="true" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
          <ul className="gui-popup" >
            <li><button>
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Checkout
            </button></li>
            <li><button>
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Quick Pay
            </button></li>
            <li><button>
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Save for later
            </button></li>
          </ul>
        </span>
      </div>
    </>
  )
}

export default App
