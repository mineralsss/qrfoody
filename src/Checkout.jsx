import React from 'react';
import { useLocalStorageValue } from '@react-hookz/web';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Use same theme as Landing
const theme = createTheme({
  palette: {
    primary: {
      main: "#ff5722",
    },
    secondary: {
      main: "#4caf50",
    },
  },
});

function Checkout() {
    const cartState = useLocalStorageValue('cart', {
        defaultValue: [],
        initializeWithValue: true,
      });
      
      // Access the values separately
      const cart = cartState.value;
      const setCart = cartState.set;
  
  const navigate = useNavigate();
  
  // Calculate total - add safety check
  const total = Array.isArray(cart) 
    ? cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    : 0;
  
  // Update item quantity
  const updateQuantity = (index, change) => {
    if (!Array.isArray(cart)) return;
    
    setCart(currentCart => {
      const safeCart = Array.isArray(currentCart) ? currentCart : [];
      const newCart = [...safeCart];
      
      if (index >= newCart.length) return newCart;
      
      const newQuantity = newCart[index].quantity + change;
      
      if (newQuantity <= 0) {
        newCart.splice(index, 1); // Remove item if quantity is 0
      } else {
        newCart[index].quantity = newQuantity;
      }
      
      return newCart;
    });
  };
  
  // Remove item completely
  const removeItem = (index) => {
    if (!Array.isArray(cart)) return;
    
    setCart(currentCart => {
      const safeCart = Array.isArray(currentCart) ? currentCart : [];
      const newCart = [...safeCart];
      
      if (index >= 0 && index < newCart.length) {
        newCart.splice(index, 1);
      }
      
      return newCart;
    });
  };
  
  // Go back to menu
  const goBack = () => {
    navigate('/');
  };
  
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ pt: 4, pb: 8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={goBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Your Cart
          </Typography>
        </Box>
        
        {cart.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Your cart is empty
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={goBack}
            >
              Back to Menu
            </Button>
          </Box>
        ) : (
          <>
            {cart.map((item, index) => (
              <Card key={index} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <CardMedia
                  component="img"
                  sx={{ width: 100, height: 100, objectFit: 'cover' }}
                  image={item.imageUrl}
                  alt={item.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.price.toLocaleString('de-DE')} vnd
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => updateQuantity(index, -1)}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ mx: 1 }}>
                      {item.quantity}
                    </Typography>
                    <IconButton 
                      size="small"
                      onClick={() => updateQuantity(index, 1)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => removeItem(index)}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    
                    <Typography sx={{ ml: 'auto' }}>
                      {(item.price * item.quantity).toLocaleString('de-DE')} vnd
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
            
            <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                Total: {total.toLocaleString('de-DE')} vnd
              </Typography>
              
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={() => alert('Order placed!')} // Replace with actual checkout logic
              >
                Place Order
              </Button>
            </Box>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default Checkout;