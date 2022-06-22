import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import { climbToWindow } from '../utils';

export type MenuOption = {
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  childrenOptions?: Omit<MenuOption, 'childrenOptions'>[];
};

export interface MenuProps {
  options: MenuOption[];
  label: string;
  className: string;
}

export default function Menu(props: MenuProps) {
  const { className, label, options } = props;

  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggleVisible = () => {
    const menuList = menuRef.current!.lastElementChild as HTMLUListElement;
    menuList.classList.toggle('hidden');
  };

  const handleClickWindow = (e: MouseEvent) => {
    let element = e.target as Element | null;
    climbToWindow(
      element,
      el => el === menuRef.current,
      () => {
        const menuList = menuRef.current!.lastElementChild as HTMLUListElement;
        menuList.classList.toggle('hidden', true);
      }
    );
  };

  useEffect(() => {
    window.addEventListener('click', handleClickWindow);
    return () => {
      window.removeEventListener('click', handleClickWindow);
    };
  }, []);

  return (
    <div
      className={cn(className, 'menu relative')}
      onClick={handleToggleVisible}
      ref={menuRef}
    >
      <button className="h-full px-2 focus:bg-gray-100">{label}</button>

      {/* main menu */}
      <ul className="absolute z-10 w-max bg-white border-1 border-gray-100 shadow-sm hidden">
        {options.map(
          ({ label, onClick, onMouseEnter, childrenOptions }, index) => (
            <li
              key={index}
              className="relative group hover:bg-[var(--header-btn-hover-bg)]"
            >
              <button
                className="w-full px-4 py-1.5 text-left"
                onClick={onClick}
                onMouseEnter={onMouseEnter}
              >
                {label}
              </button>

              {/* submenu */}
              {!!childrenOptions && childrenOptions.length > 0 && (
                <ul className="absolute left-[calc(100%-2px)] top-0 z-10 w-max bg-white border-1 border-gray-100 shadow-sm hidden group-hover:block">
                  {childrenOptions.map(
                    ({ label, onClick, onMouseEnter }, index) => (
                      <li key={index}>
                        <button
                          className="w-full px-4 py-1.5 text-left hover:bg-[var(--header-btn-hover-bg)]"
                          onClick={onClick}
                          onMouseEnter={onMouseEnter}
                        >
                          {label}
                        </button>
                      </li>
                    )
                  )}
                </ul>
              )}
            </li>
          )
        )}
      </ul>
    </div>
  );
}
