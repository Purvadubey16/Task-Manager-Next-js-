// 'use client';

// import * as React from 'react';
// import {
//   Box,
//   Drawer,
//   IconButton,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
//   Divider,
//   Toolbar,
//   Typography,
//   ListItemIcon,
// } from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import Link from 'next/link'; // ✅ Use Next.js Link
// import Image from 'next/image';
// import HomeIcon from '@mui/icons-material/Home';
// import PersonIcon from '@mui/icons-material/Person';
// import PeopleIcon from '@mui/icons-material/People';
// import HelpIcon from '@mui/icons-material/Help';
// import ListIcon from '@mui/icons-material/List';



// export default function Navbar() {
//   const [open, setOpen] = React.useState(false);

//   const toggleDrawer = (newOpen) => () => {
//     setOpen(newOpen);
//   };

//   // Define nav items with text and paths
//   const navItems = [
//     { text: 'Home',path:"#",icon: <HomeIcon />},
//     { text: "Task Manager", path: "/dashboard",icon:<ListIcon/> },
//     { text: 'User',path:"#",icon:<PersonIcon/>},
//     { text: 'Profile',path:"#",icon:<PeopleIcon/>},
//     { text: 'Help & support',path:"#",icon:<HelpIcon/>}
//     // { text: "Task Summary", path: "/activity" },
//     // { text: "Profile", path: "/profile" }
//   ];

//   const DrawerList = (
//     <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>

// <List>
//     <ListItem>
//       <div className='pl-7'>
//     <Image
//       src="/alitlogo.png"  // Path to your image
//       alt="Logo"
//       width={100}
//       height={100}
//     /></div>
//   </ListItem>
//   <ListItem>
//     <Typography variant="h5" fontWeight="bold">
//       Task Manager
//     </Typography>
//   </ListItem>
// </List>
// <Divider />


//       <List>

        
//         {navItems.map(({ text, path, icon }) => (
//           <ListItem key={text} disablePadding>
//             <Link href={path} style={{ textDecoration: 'none', color: 'inherit',width: '100%'  }}>
//   <ListItemButton  sx={{
//             '&:hover': {
//               backgroundColor: '#EDC824', // background turns yellow
//               color: 'black',            // optional: text/icon stays readable
//               '& .MuiListItemIcon-root': {
//                 color: 'black',         // icon color on hover
//               },
//             },
//           }}>
//      <ListItemIcon sx={{ color: 'inherit' }}>{icon}</ListItemIcon>
//     <ListItemText primary={text} />
//   </ListItemButton>
// </Link>

//           </ListItem>
//         ))}
//       </List>
//       <Divider />
//     </Box>
//   );

//   return (
//     <>
//       <Toolbar className="flex justify-between items-center ">
//         <IconButton
//           size="large"
//           edge="start"
//           color="inherit"
//           aria-label="menu"
//           onClick={toggleDrawer(true)}
//            sx={{ paddingLeft: 0, paddingRight: 0 }} 
//         >
//           <MenuIcon />
//         </IconButton>
       
//       </Toolbar>

//       <Drawer 
//       anchor="left" 
//       open={open} 
//       onClose={toggleDrawer(false)}  
//       sx={{
//     '& .MuiDrawer-paper': {
//       backgroundColor: 'white', // dark emerald
//       color: 'black',             // optional: text color
//     },
//   }} >
//         {DrawerList}
//       </Drawer>
//     </>
//   );
// }
'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import HelpIcon from '@mui/icons-material/Help';
import ListIcon from '@mui/icons-material/List';

const navItems = [
  { text: 'Home', path: '/home', icon: <HomeIcon /> },
  { text: 'Task Manager', path: '/dashboard', icon: <ListIcon /> },
  { text: 'User', path: '#', icon: <PersonIcon /> },
  { text: 'Profile', path: '/profileInfo', icon: <PeopleIcon /> },
  { text: 'Help & support', path: '/help', icon: <HelpIcon /> }
];

export default function Navbar() {
  return (
    <Box
      sx={{
        width: 250,
        height: '100vh',
        backgroundColor: '#fff',
        borderRight: '1px solid #ddd',
        // paddingTop: 2,
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 50
      }}
    >
      <List>
      <ListItem>
  <Box display="flex" alignItems="center">
    <Image src="/alitlogo.png" alt="Logo" width={70} height={70} />
    <Typography variant="h6" fontWeight="bold"  sx={{ color: '#EDC824' }} className='pl-3'>
      Task Manager
    </Typography>
  </Box>
</ListItem>

      </List>
      
      <List>
        {navItems.map(({ text, path, icon }) => (
          <ListItem key={text} disablePadding>
            <Link
              href={path}
              style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}
            >
              <ListItemButton
  sx={{
    '&:hover': {
      backgroundColor: '#EDC824', // Button background on hover
      color: 'white', // Text color on hover
      '& .MuiListItemIcon-root': {
        color: 'white', // ✅ Ensures icon color changes on hover
      },
    },
  }}
>
  <ListItemIcon sx={{ color: 'inherit', transition: 'color 0.3s ease-in-out' }}>
    {icon}
  </ListItemIcon>
  <ListItemText primary={text} />
</ListItemButton>

            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
