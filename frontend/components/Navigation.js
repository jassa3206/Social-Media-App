import React from 'react';
import Link from 'next/link';
import { IoHomeOutline } from "react-icons/io5";
import { FiSave, FiSearch } from "react-icons/fi";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdOutlineExplore } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import styles from './Navigation.module.css'
import { RiSave2Fill } from 'react-icons/ri';

const Navigation = () => {
    return (
        <nav>
           <div className={styles.nav}>
            <div>
                <Link className={styles.links} href="/Home"><IoHomeOutline size={27} color='white'/></Link>
            </div>
            <div>
                <Link className={styles.links} href="/Search"><FiSearch size={27} color='white'/></Link>
            </div>
            <div>
                <Link className={styles.links} href="/Post"><IoAddCircleOutline  size={27} color='white'/></Link>
            </div>
            <div>
                <Link className={styles.links} href="/Explore"><MdOutlineExplore size={27} color='white'/></Link>
            </div>
            <div>
                <Link className={styles.links} href="/Profile"><IoPersonCircleOutline size={27} color='white'/>
                </Link>
            </div>
            <div>
                <Link className={styles.links} href="/Saved"><RiSave2Fill size={26} color='white'/>
                </Link>
            </div>
           </div>
        </nav>
    );
};

export default Navigation;
