import React, { useState, useContext, useRef, useEffect } from 'react';
import { useLocalStorageValue } from '@react-hookz/web';
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
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import { styled as muiStyled } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import { useNavigate } from 'react-router-dom'; 
import CallIcon from '@mui/icons-material/Call';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const BottomActionButtons = ({ itemCount }) => {
  const navigate = useNavigate();
  
  const handleCallEmployee = () => {
    // You can implement your actual call functionality here
    alert("Nhân viên đã được gọi đến bàn của bạn!");
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  return (
    <>
      {/* Left side - Call Employee button with label */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          left: 16,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            backgroundColor: 'rgba(255,255,255,0.8)',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            mb: 1,
            fontSize: '0.7rem',
            fontWeight: 'bold',
            color: '#333',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          Gọi Nhân Viên
        </Typography>
        <Fab 
          color="secondary" 
          aria-label="call employee"
          className="cart-button"
          size="medium"
          onClick={handleCallEmployee}
        >
          <CallIcon />
        </Fab>
      </Box>
      
      {/* Right side - Checkout button (unchanged) */}
      <Fab 
        color="primary" 
        aria-label="checkout"
        className="cart-button"
        size="medium"
        onClick={handleCheckout}
        disabled={itemCount === 0}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <StyledBadge badgeContent={itemCount} color="secondary">
          <ShoppingCartCheckoutIcon />
        </StyledBadge>
      </Fab>
    </>
  );
};

const StyledBadge = muiStyled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: -3,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const CartButton = ({ itemCount }) => {
  const navigate = useNavigate();
  
  const handleCartClick = () => {
    navigate('/checkout'); // Navigate to checkout page
  };
  
  return (
    <Fab 
      color="primary" 
      aria-label="cart"
      className="cart-button"
      size="medium"
      onClick={handleCartClick} // Add click handler
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
  
  // Create an item object to add to cart
  const handleAddToCart = () => {
    addToCart({
      name: menuName,
      imageUrl: menuFood,
      price: price,
      description: menuDetail
    });
  };
  
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
        size="small"
        className="price-button"
        onClick={handleAddToCart}
        sx={{ 
          mt: 1,
          maxWidth: '70%',
          alignSelf: 'center',
          fontSize: '0.85rem',
          py: 0.5,
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
              onClick={handleAddToCart}
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
              addToCart={() => addToCart(item)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}


function ButtonAppBar() {  
  const theme = createTheme({
  palette: {
    primary: {
      main: "#81cd28",
    },
    secondary: {
      main: "#4caf50",
    },
  },
  typography: {
    fontFamily: "'Nunito', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
    },
  },
});
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <MuiThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed"> {/* Change from "flexible" to "fixed" */}
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
            </IconButton>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1, 
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.9
                }
              }} 
              align='left'
              onClick={scrollToTop}
            >
              <strong>Mune</strong> QR
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
              Bàn Số 2
            </Typography>
          </Toolbar>
        </AppBar>
        
        {/* Add a toolbar placeholder to prevent content from hiding under the AppBar */}
        <Toolbar />
      </Box>
    </MuiThemeProvider>
  );
}

const mainApp = () => {
    // State for tracking popup visibility and selected image
    const [showPopup, setShowPopup] = useState(false);
    const [selectedSlide, setSelectedSlide] = useState(0);
    const [autoplay, setAutoplay] = useState(true);
    
    // Replace this line:
    // const [cart, setCart] = useLocalStorage('cart', []);
    
    // With this:
    const cartState = useLocalStorageValue('cart', {
      defaultValue: [],
      initializeWithValue: true,
    });
    const cart = cartState.value;
    const setCart = cartState.set;
    // Get cart count from cart items (no changes needed here)
    const cartItemCount = Array.isArray(cart) ? cart.reduce((total, item) => total + item.quantity, 0) : 0;
    
    // Enhanced addToCart function
    const addToCart = (item) => {
      setCart(currentCart => {
        // Ensure currentCart is an array
        const safeCart = Array.isArray(currentCart) ? currentCart : [];
        
        // Check if item already exists in cart
        const existingItemIndex = safeCart.findIndex(
          cartItem => cartItem.name === item.name
        );
        
        if (existingItemIndex >= 0) {
          // If item exists, increase quantity
          const newCart = [...safeCart];
          newCart[existingItemIndex] = {
            ...newCart[existingItemIndex],
            quantity: newCart[existingItemIndex].quantity + 1
          };
          return newCart;
        } else {
          // If item doesn't exist, add it with quantity 1
          return [...safeCart, { ...item, quantity: 1 }];
        }
      });
    };
    
    // Add item from menu grid
    const handleAddToCartFromMenu = (item) => {
      addToCart(item);
    };
    
    // Add item from slider popup
    const handleAddToCartFromSlider = () => {
      const selectedItem = imageData[selectedSlide];
      addToCart({
        name: selectedItem.title,
        imageUrl: selectedItem.url,
        price: selectedItem.price,
        description: selectedItem.description
      });
    };
    
    // Image data with details
    const imageData = [
        {
            url: "https://static.kfcvietnam.com.vn/images/items/lg/Pasta-Nuggets.jpg?v=gOqvkL",
            title: "Mì Ý Và Gà Viên",
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
      // Starters
      {
        name: "Chả Giò Hải Sản",
        imageUrl: "https://www.monngonsaigon.vn/images/1/huong-dan-cach-lam-cha-gio-hai-san-sieu-ngon1_1629345767.jpg",
        description: "Nem rán giòn với nhân hải sản, thịt heo băm, nấm mèo và bún tàu, ăn kèm rau sống và nước mắm.",
        price: 85000
      },
      {
        name: "Gỏi Cuốn Tôm Thịt",
        imageUrl: "https://www.cet.edu.vn/wp-content/uploads/2018/11/goi-cuon-tom-thit.jpg",
        description: "Bánh tráng cuốn với tôm, thịt heo, bún, rau thơm và rau sống, ăn kèm nước mắm me đặc biệt.",
        price: 75000
      },
      {
        name: "Cánh Gà Tẩm Bột Chiên Giòn",
        imageUrl: "https://i.imgur.com/loleye9.jpg",
        description: "Cánh gà chiên giòn phủ sốt cay ngọt kiểu Hàn Quốc, rắc mè rang và hành lá.",
        price: 95000
      },
      
      // Main Dishes - Rice
      {
        name: "Cơm Tấm Sườn Nướng",
        imageUrl: "https://i.ytimg.com/vi/cJu6tFJe_Gc/maxresdefault.jpg",
        description: "Cơm tấm dẻo thơm với sườn heo nướng, đồ chua, mỡ hành và nước mắm pha đặc biệt.",
        price: 110000
      },
      {
        name: "Cơm Gà Xối Mỡ",
        imageUrl: "https://www.huongnghiepaau.com/wp-content/uploads/2018/07/com-ga-xoi-mo.jpg",
        description: "Cơm trắng với gà ta xối mỡ vàng giòn, dưa leo và nước mắm gừng.",
        price: 100000
      },
      
      // Main Dishes - Noodles
      {
        name: "Phở Bò Tái Nạm",
        imageUrl: "https://phovihoang.vn/wp-content/uploads/2018/02/N%E1%BA%A0M-T%C3%81I.png",
        description: "Phở bò truyền thống với nước dùng ngọt thanh, bánh phở mềm, bò tái và nạm, ăn kèm giá đỗ, rau quế.",
        price: 120000
      },
      {
        name: "Bún Bò Huế",
        imageUrl: "https://hoasenfoods.vn/wp-content/uploads/2024/01/bun-bo-hue.jpg",
        description: "Bún bò Huế cay nồng với nước dùng đặc trưng, thịt bò, giò heo, chả cua và rau sống.",
        price: 115000
      },
      {
        name: "Mì Xào Hải Sản",
        imageUrl: "https://cdn.tgdd.vn/2022/05/CookRecipe/GalleryStep/thanh-pham-16.jpg",
        description: "Mì trứng xào với tôm, mực, cá viên, rau củ tươi ngon và sốt xào đặc biệt.",
        price: 130000
      },
      
      // Western Food
      {
        name: "Burger Đặc Biệt",
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Thịt bò mọng nước với phô mai, rau xà lách, cà chua và sốt đặc biệt.",
        price: 129000
      },
      {
        name: "Pizza Margherita",
        imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Pizza Ý truyền thống với sốt cà chua, phô mai mozzarella và húng quế.",
        price: 149000
      },
      {
        name: "Pasta Carbonara",
        imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Mì Ý sợi dài với sốt kem béo ngậy, thịt xông khói, trứng và phô mai parmesan.",
        price: 135000
      },
      
      // Seafood
      {
        name: "Cá Hồi Nướng Teriyaki",
        imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Cá hồi Na Uy tươi nướng với sốt teriyaki, phục vụ kèm cơm trắng và rau củ xào.",
        price: 175000
      },
      {
        name: "Tôm Sú Rang Muối",
        imageUrl: "https://www.huongnghiepaau.com/wp-content/uploads/2019/01/tom-su-rang-muoi-hong-kong.jpg",
        description: "Tôm sú tươi ngon rang với muối, tiêu, ớt và hành tỏi thơm phức.",
        price: 195000
      },
      
      // Vegetarian
      {
        name: "Salad Caesar",
        imageUrl: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Rau xà lách tươi, phô mai parmesan, bánh mì giòn và sốt Caesar.",
        price: 95000
      },
      {
        name: "Đậu Hũ Sốt Cà Chua",
        imageUrl: "https://cdn3.ivivu.com/2020/09/dau-hu-chien-sot-ca-chua-ivivu-3.jpg",
        description: "Đậu hũ non chiên giòn với sốt cà chua, hành tây và ớt chuông ngọt.",
        price: 85000
      },
      
      // Desserts
      {
        name: "Chè Thái",
        imageUrl: "https://cdn.eva.vn/upload/3-2023/images/2023-07-06/3-cach-lam-che-thai-thom-ngon-mat-lanh-cho-ngay-he-nong-nuc-cach-lam-che-thai-eva-009-1688635042-913-width599height395.jpg",
        description: "Chè Thái thơm ngon với nhiều loại trái cây, thạch rau câu, sữa đặc và nước cốt dừa.",
        price: 55000
      },
      {
        name: "Bánh Flan Caramel",
        imageUrl: "https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/32121D5E-D3DF-4FD9-BE6E-7EB53562A1DE/Derivates/02DCA6F3-23D3-4F25-92B2-EAEF2A6606F3.jpg",
        description: "Bánh flan mềm mịn với lớp caramel ngọt đắng, trang trí với lá bạc hà tươi.",
        price: 45000
      },
      
      // Drinks
      {
        name: "Sinh Tố Bơ",
        imageUrl: "https://bizweb.dktcdn.net/100/004/714/articles/sinh-to-bo.png?v=1569302291017",
        description: "Sinh tố bơ đặc sánh, ngọt thanh, phủ đá bào và sữa đặc.",
        price: 65000
      },
      {
        name: "Trà Đào Cam Sả",
        imageUrl: "https://product.hstatic.net/200000791069/product/lord-50_5221e714bef5444aaab6759e2a219146_master.jpg",
        description: "Trà đào thơm mát với lát đào tươi, cam vàng và sả nhẹ nhàng.",
        price: 55000
      },
      {
        name: "Cà Phê Sữa Đá",
        imageUrl: "https://f5cafe.com/wp-content/uploads/2020/06/ca_phe_sua_da.jpg",
        description: "Cà phê phin truyền thống với sữa đặc, phục vụ với đá.",
        price: 45000
      }
    ];

    // First, organize your menu items by category
    const startersRef = useRef(null);
    const riceRef = useRef(null);
    const noodlesRef = useRef(null);
    const westernRef = useRef(null);
    const seafoodRef = useRef(null);
    const vegetarianRef = useRef(null);
    const dessertsRef = useRef(null);
    const drinksRef = useRef(null);
    
    // State for active tab
    const [activeTab, setActiveTab] = useState(0);
    
    // Group your existing menu items by category
    const menuCategories = [
      {
        name: "Khai Vị",
        ref: startersRef,
        items: menuItems.slice(0, 3) // The first 3 items are starters
      },
      {
        name: "Cơm",
        ref: riceRef,
        items: menuItems.slice(3, 5) // Rice dishes
      },
      {
        name: "Món Mì",
        ref: noodlesRef,
        items: menuItems.slice(5, 8) // Noodle dishes
      },
      {
        name: "Món Âu",
        ref: westernRef,
        items: menuItems.slice(8, 11) // Western food
      },
      {
        name: "Hải Sản",
        ref: seafoodRef,
        items: menuItems.slice(11, 13) // Seafood
      },
      {
        name: "Món Chay",
        ref: vegetarianRef,
        items: menuItems.slice(13, 15) // Vegetarian
      },
      {
        name: "Tráng Miệng",
        ref: dessertsRef,
        items: menuItems.slice(15, 17) // Desserts
      },
      {
        name: "Đồ Uống",
        ref: drinksRef,
        items: menuItems.slice(17, 20) // Drinks
      }
    ];
    
    // Add this state to track if we're programmatically scrolling
    const [isScrolling, setIsScrolling] = useState(false);
    
    // Handle tab changes and scroll to appropriate section
    const handleTabChange = (event, newValue) => {
      setActiveTab(newValue);
      
      // Prevent intersection observer from changing tabs during programmatic scrolling
      setIsScrolling(true);
      
      // Scroll to the selected category section
      if (menuCategories[newValue].ref.current) {
        // Get the element
        const element = menuCategories[newValue].ref.current;
        
        // Get the element's position relative to the viewport
        const elementRect = element.getBoundingClientRect();
        
        // Calculate the scroll position (current scroll + element position - offset)
        // The offset accounts for the AppBar (64px) + some extra space (20px)
        const offset = 84; // AppBar height (64px) + extra spacing (20px)
        const scrollPosition = window.pageYOffset + elementRect.top - offset;
        
        // Perform the scroll with smooth behavior
        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
        
        // Reset the scrolling flag after animation completes
        setTimeout(() => {
          setIsScrolling(false);
        }, 1000); // Matches the typical duration of smooth scrolling
      }
    };

    // Set up intersection observer with better stability
    useEffect(() => {
      // Adjust rootMargin to look at a smaller window just below the AppBar
      const options = {
        root: null,
        rootMargin: '-84px 0px -80% 0px',
        threshold: [0.01, 0.05, 0.1]
      };

      let debounceTimer = null;
      
      const observer = new IntersectionObserver((entries) => {
        // Skip updates during programmatic scrolling
        if (isScrolling) return;
        
        // Get all currently visible sections
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        if (visibleEntries.length > 0) {
          // Find the section that's CURRENTLY most visible - we want the one
          // whose top edge is just below the AppBar or closest to it
          const appBarHeight = 84; // Same as your offset
          
          const topEntry = visibleEntries.reduce((prev, current) => {
            // Calculate how far each section's top is from the ideal position (just below AppBar)
            const prevTopDistance = Math.abs(prev.boundingClientRect.top - appBarHeight);
            const currentTopDistance = Math.abs(current.boundingClientRect.top - appBarHeight);
            
            // Return the one whose top is closest to the ideal position
            return prevTopDistance < currentTopDistance ? prev : current;
          });
          
          // Get the index of the section
          const newIndex = menuCategories.findIndex(category => 
            category.ref.current === topEntry.target
          );
          
          // Only update if we have a valid index and it's different from current
          if (newIndex !== -1 && newIndex !== activeTab) {
            // Clear any pending timer
            if (debounceTimer) clearTimeout(debounceTimer);
            
            // Set a debounce for smoother transitions
            debounceTimer = setTimeout(() => {
              setActiveTab(newIndex);
            }, 150);
          }
        }
      }, options);

      // Observe all section refs
      menuCategories.forEach(category => {
        if (category.ref.current) {
          observer.observe(category.ref.current);
        }
      });

      // Cleanup
      return () => {
        if (debounceTimer) clearTimeout(debounceTimer);
        
        menuCategories.forEach(category => {
          if (category.ref.current) {
            observer.unobserve(category.ref.current);
          }
        });
      };
    }, [menuCategories, activeTab, isScrolling]);

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
            <ButtonAppBar />
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
            <hr className="solid"></hr>
            <Box sx={{ position: 'sticky', top: 64, zIndex: 10, bgcolor: 'white', boxShadow: 1 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="menu categories"
                sx={{ 
                  minHeight: 48,
                  '& .MuiTab-root': { minHeight: 48, py: 1 },
                  borderBottom: 1, 
                  borderColor: 'divider' 
                }}
              >
                {menuCategories.map((category, index) => (
                  <Tab 
                    key={index} 
                    label={category.name} 
                    sx={{ 
                      fontWeight: activeTab === index ? 'bold' : 'normal',
                      color: activeTab === index ? '#81cd28' : 'inherit'
                    }}
                  />
                ))}
              </Tabs>
            </Box>

            <div className="menu-container">
              {menuCategories.map((category, index) => (
                <div key={index} ref={category.ref}>
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    sx={{ 
                      mt: 4, 
                      mb: 2, 
                      pl: 3, 
                      borderLeft: '4px solid #81cd28',
                      fontWeight: 'bold'
                    }}
                  >
                    {category.name}
                  </Typography>
                  
                  <ResponsiveGrid 
                    menuItems={category.items}
                    addToCart={handleAddToCartFromMenu}
                  />
                </div>
              ))}
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
                            onClick={handleAddToCartFromSlider}
                            sx={{ 
                              mt: 2,
                              display: 'block', // Make it a block element
                              mx: 'auto',      // Set horizontal margins to auto
                              px: 3,           // Add some horizontal padding to make it wider
                          }}
                        >{imageData[selectedSlide].price.toLocaleString('de-DE')} vnd</Button>
                    </div>
                </div>
            )}
              <BottomActionButtons itemCount={cartItemCount} />
        </React.Fragment></>
    );
    
  };

export default mainApp;