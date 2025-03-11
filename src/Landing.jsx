import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import './Landing.css';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid2';
import CssBaseline from '@mui/material/CssBaseline';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import { styled as muiStyled } from '@mui/material/styles';
import Fab from '@mui/material/Fab';



const theme = createTheme({
    palette: {
      primary: {
        main: "#ff5722", // Change primary color
      },
      secondary: {
        main: "#4caf50", // Change secondary color
      },
    },
  });

const StyledBadge = muiStyled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: -3,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const CartButton = ({ itemCount }) => {
  return (
    <Fab 
      color="primary" 
      aria-label="cart"
      className="cart-button"
      size="medium"
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
      }}
    >
      <StyledBadge badgeContent={itemCount} color="secondary">
        <ShoppingCartIcon />
      </StyledBadge>
    </Fab>
  );
};


const ControlledPopup = ({ menuFood, menuDetail, menuName, price, addToCart }) => {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  return (
    <div className="food-item-container">
      <button type="button" className="food-button" onClick={() => setOpen(o => !o)}>
        <img 
          src={menuFood} 
          alt={menuName}
          className="food-thumbnail" 
        />
        <div className="food-name">{menuName}</div>
      </button>

      <Button 
        variant="contained" 
        color="primary"
        size = "small"
        className="price-button"
        onClick = {addToCart}
        sx={{ 
          mt: 1,
          maxWidth: '70%',  // Control the width
          alignSelf: 'center', // Center the button
          fontSize: '0.85rem', // Smaller font size
          py: 0.5, // Reduce padding on top and bottom
        }}
      >
        {price.toLocaleString('de-DE')} vnd
      
      </Button>
      <Popup open={open} closeOnDocumentClick onClose={closeModal}>
        <div className="modal">
          <a className="close" onClick={closeModal}>
            &times;
          </a>
          <div className="popup-content-wrapper">
            <img 
              src={menuFood} 
              alt={menuName}
              className="popup-food-image"
            />
            <h3 className="popup-food-title">{menuName}</h3>
            <p className="popup-food-description">{menuDetail}</p>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={addToCart}
              sx={{ mt: 2 }}
            >{price.toLocaleString('de-DE')} vnd</Button>
          </div>
        </div>
      </Popup>
    </div>
  );
};

function ResponsiveGrid({menuItems, addToCart}) {
  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Grid 
        container 
        spacing={3} 
        columns={{ xs: 4, sm: 8, md: 12 }}
        justifyContent="center"
      >
        {menuItems.map((item, index) => (
          <Grid key={index} grid={{ xs: 12, sm: 6, md: 4, lg:3}}>
            <ControlledPopup 
              menuFood={item.imageUrl}
              menuDetail={item.description}
              menuName={item.name}
              price={item.price}
              addToCart={addToCart}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function ButtonAppBar() {
    return (
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="flexible">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} align='left'>
                <strong>QR</strong> Foody
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  px: 2, 
                  py: 0.5, 
                  borderRadius: 1,
                  fontWeight: 'bold'
                }}
              >
                Table 2
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
      );

}

function HideOnScroll(props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
    });
  
    return (
      <Slide appear={false} direction="down" in={!trigger}>
        {children ?? <div />}
      </Slide>
    );
  }


const mainApp = () => {
    // State for tracking popup visibility and selected image
    const [showPopup, setShowPopup] = useState(false);
    const [selectedSlide, setSelectedSlide] = useState(0);
    const [autoplay, setAutoplay] = useState(true);
    const [cartItemCount, setCartItemCount] = useState(0);
    const addToCart = () => {
      setCartItemCount(prevCount => prevCount + 1);
    };
    // Image data with details
    const imageData = [
        {
            url: "https://static.kfcvietnam.com.vn/images/items/lg/Pasta-Nuggets.jpg?v=gOqvkL",
            title: "Pasta Nuggets",
            description: "1 Mì Ý Gà Rán + 3 Gà Miếng Nuggets + 1 Pepsi (lớn).",
            price: 10000,
        },
        {
            url: "https://static.kfcvietnam.com.vn/images/items/lg/CBO-CHIZZA-A.jpg?v=gOqvkL",
            title: "Combo HD Chizza A",
            description: "1 Miếng Chizza + 1 Khoai Tây Chiên (vừa) + 1 Ly Pepsi (lớn).",
            price: 10000,
        },
        {
            url: "https://static.kfcvietnam.com.vn/images/items/lg/D-CBO-Big-Juicy.jpg?v=gOqvkL",
            title: "Combo Gà Quay",
            description: "1 Đùi Gà Quay Flava + 1 Salad Hạt + 1 Lipton (lớn).",
            price: 10000,
        }
    ];
    const menuItems = [
      {
          name: "Burger Classic",
          imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          description: "Juicy beef patty with cheese, lettuce, tomato, and special sauce.",
          price: 10000
      },
      {
          name: "Pizza Margherita",
          imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          description: "Classic Italian pizza with tomato sauce, mozzarella, and basil.",
          price: 10000
      },
      {
          name: "Caesar Salad",
          imageUrl: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          description: "Fresh romaine lettuce, parmesan cheese, croutons, and Caesar dressing.",
          price: 10000
      }
  ];

// Handler for slide clicks
const handleSlideClick = (index) => {
    setSelectedSlide(index);
    setShowPopup(true);
    setAutoplay(false); // Pause autoplay when popup is opened
};

// Close popup handler
const closePopup = () => {
    setShowPopup(false);
    setAutoplay(true); // Resume autoplay when popup is closed
};


    return (
        <>

            <React.Fragment>
            <CssBaseline/>
            <ThemeProvider theme={theme}>
            <HideOnScroll>
                <ButtonAppBar />
            </HideOnScroll>
            <div>
            <Slide
                arrows={false}
                autoplay={autoplay}
                duration={3000}
                infinite = {true}
                transitionDuration={500}
                canSwipe={true}
                pauseOnHover={true}
                indicators={true}
                responsive={[{
                  breakpoint: 1024, // iPad Pro breakpoint
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }, {
                  breakpoint: 768, // iPad/tablet breakpoint
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }, {
                  breakpoint: 480, // Mobile breakpoint
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }]}
            >
                {imageData.map((image, index) => (
                    <div 
                        className="each-slide-effect" 
                        key={index}
                        onClick={() => handleSlideClick(index)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div style={{ 'backgroundImage': `url(${image.url})` }}>
                        </div>
                    </div>
                ))}
            </Slide>
            </div>
            <hr class="solid"></hr>
            <div className="menu-container">
              <ResponsiveGrid menuItems={menuItems} addToCart={addToCart}/>
            </div>
            {/* Image Detail Popup */}
            {showPopup && (
                <div className="popup-overlay" onClick={closePopup}>
                    <div className="popup-content" onClick={e => e.stopPropagation()}>
                        <button className="close-button" onClick={closePopup}>×</button>
                        <img 
                            src={imageData[selectedSlide].url} 
                            alt={imageData[selectedSlide].title}
                            className="popup-image"
                        />
                        <h2>{imageData[selectedSlide].title}</h2>
                        <p>{imageData[selectedSlide].description}</p>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            align="center"
                            onClick={addToCart}
                            sx={{ 
                              mt: 2,
                              display: 'block', // Make it a block element
                              mx: 'auto',      // Set horizontal margins to auto
                              px: 3,           // Add some horizontal padding to make it wider
                          }}
                        >{imageData[selectedSlide].price.toLocaleString('de-DE')} vnd</Button>
                    </div>
                    <div></div>
                </div>
            )}
              <CartButton itemCount={cartItemCount} />
            </ThemeProvider>
        </React.Fragment></>
    );
    
  };

export default mainApp;