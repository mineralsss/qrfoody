import React, { useState } from 'react';
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
import NoteIcon from '@mui/icons-material/Note';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

// Use same theme as Landing
const theme = createTheme({
  palette: {
    primary: {
      main: "#81cd28", // Changed from #ff5722 to match Landing.jsx
    },
    secondary: {
      main: "#4caf50",
    },
  },
});

function Checkout() {
  // Existing state hooks
  const cartState = useLocalStorageValue('cart', {
    defaultValue: [],
    initializeWithValue: true,
  });
  const cart = cartState.value;
  const setCart = cartState.set;
  
  // Add these new state hooks
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  
  // Move this hook to the top level of the component
  const ordersState = useLocalStorageValue('orders', {
    defaultValue: [],
    initializeWithValue: true,
  });
  
  // Add state for table number
  const [tableNumber, setTableNumber] = useState(2); // Default table from app bar
  const { set } = useLocalStorageValue("orderData", { initializeWithValue: false , stringify:JSON.stringify});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();
  
  // Handle placing an order
  const handlePlaceOrder = () => {
    // Create new order object
    const newOrder = {
      tableNumber: tableNumber,
      timestamp: new Date().toISOString(),
      status: "new",
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        notes: item.notes || ""  // Use existing notes or empty string
      }))
    };

    const sendOrder = (newOrder) => {
      set(newOrder);
    };
    


    // Add to orders in localStorage using the hook we defined at the component level
    ordersState.set(currentOrders => {
      const safeOrders = Array.isArray(currentOrders) ? currentOrders : [];
      return [...safeOrders, newOrder];
    });
    
    // Clear cart and show confirmation
    sendOrder(newOrder);
    setCart([]);
    setOrderPlaced(true);
  };
  
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

  // Add these functions inside your Checkout component
  const openNoteDialog = (index) => {
    const item = cart[index];
    setCurrentNote(item.notes || '');
    setEditingItemIndex(index);
    setNoteDialogOpen(true);
  };

  const saveNote = () => {
    if (editingItemIndex === null) return;
    
    setCart(currentCart => {
      const newCart = [...currentCart];
      newCart[editingItemIndex] = {
        ...newCart[editingItemIndex],
        notes: currentNote
      };
      return newCart;
    });
    
    // Close dialog and reset state
    setNoteDialogOpen(false);
    setEditingItemIndex(null);
  };
  
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ pt: 4, pb: 8 }}>
        {orderPlaced ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" sx={{ mb: 2, color: 'success.main' }}>
              Order Placed Successfully!
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Your order has been sent to the kitchen.
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
                      
                      {/* Display notes if they exist */}
                      {item.notes && (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            mt: 1, 
                            bgcolor: 'rgba(129,205,40,0.05)', // Changed from rgba(255,87,34,0.05)
                            p: 1, 
                            borderRadius: 1,
                            borderLeft: '3px solid #81cd28', // Changed from #ff5722
                            fontStyle: 'italic'
                          }}
                        >
                          {item.notes}
                        </Typography>
                      )}
                      
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
                        
                        {/* Add Note Icon */}
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => openNoteDialog(index)}
                          sx={{ ml: 1 }}
                          aria-label="add note"
                        >
                          <NoteIcon fontSize="small" />
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

                </Box>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={handlePlaceOrder} // Connect the function
                  >
                    Place Order
                  </Button>

              </>
            )}
          </>
        )}
        
        {/* Add this at the bottom of your component, before the final closing tags */}
        <Dialog open={noteDialogOpen} onClose={() => setNoteDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Special Instructions</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="note"
              label="Add any special requests for this item"
              type="text"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNoteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveNote} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}

export default Checkout;