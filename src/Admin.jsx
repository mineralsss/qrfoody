import React, { useState, useEffect } from 'react';
import { useLocalStorageValue } from '@react-hookz/web';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid2';
import Chip from '@mui/material/Chip';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import NoteIcon from '@mui/icons-material/Note';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

// Theme for admin interface
const theme = createTheme({
  palette: {
    primary: {
      main: "#81cd28", // Changed from blue (#2196f3) to green to match other pages
    },
    secondary: {
      main: "#4caf50", // Updated to match other pages
    },
    success: {
      main: "#4caf50", // Green for completed orders
    },
    warning: {
      main: "#ff9800", // Orange for in-progress
    },
    error: {
      main: "#f44336", // Red for new/pending
    }
  },
});

function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [currentItemName, setCurrentItemName] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // 'all', 'today', 'yesterday', 'thisWeek', 'custom'
  const [customDate, setCustomDate] = useState(''); // For custom date selection
  
  // Add this function to calculate total revenue
  const calculateTotalRevenue = (ordersList) => {
    return ordersList.reduce((total, order) => {
      if (!order.items || !Array.isArray(order.items)) return total;
      
      const orderTotal = order.items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);
      
      return total + orderTotal;
    }, 0);
  };
  
  // Get orders data from localStorage
  const ordersState = useLocalStorageValue('orders', {
    defaultValue: [],
    initializeWithValue: true,
  });
  
  const orders = Array.isArray(ordersState.value) ? ordersState.value : [];
  const setOrders = ordersState.set;
  
  // Filter orders based on active tabS
  const isWithinDateFilter = (timestamp) => {
    if (!timestamp || activeTab !== 3) return true; // Only apply date filter for "All Orders" tab
    
    try {
      const orderDate = new Date(timestamp);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const thisWeekStart = new Date(today);
      thisWeekStart.setDate(thisWeekStart.getDate() - today.getDay()); // Start of week (Sunday)
      
      switch (dateFilter) {
        case 'today':
          return orderDate >= today;
        case 'yesterday':
          return orderDate >= yesterday && orderDate < today;
        case 'thisWeek':
          return orderDate >= thisWeekStart;
        case 'custom':
          if (!customDate) return true;
          const filterDate = new Date(customDate);
          filterDate.setHours(0, 0, 0, 0);
          const nextDay = new Date(filterDate);
          nextDay.setDate(nextDay.getDate() + 1);
          return orderDate >= filterDate && orderDate < nextDay;
        case 'all':
        default:
          return true;
      }
    } catch (e) {
      console.error("Error filtering by date:", e);
      return true;
    }
  };
  
  const filteredOrders = activeTab === 3 
    ? orders.filter(order => isWithinDateFilter(order.timestamp)) 
    : orders.filter(order => {
        if (activeTab === 0) return order.status === "new";
        if (activeTab === 1) return order.status === "in-progress";
        if (activeTab === 2) return order.status === "completed";
        return true;
      });
  
  // Count orders in each status
  const newOrdersCount = orders.filter(o => o.status === "new").length;
  const inProgressCount = orders.filter(o => o.status === "in-progress").length;
  const completedCount = orders.filter(o => o.status === "completed").length;
  
  // Update order status
  const updateOrderStatus = (orderToUpdate, newStatus) => {
    setOrders(currentOrders => {
      return currentOrders.map(order => {
        if (order.timestamp === orderToUpdate.timestamp) {
          const updatedOrder = {...order, status: newStatus};
          
          // Add timestamp for the status change
          if (newStatus === 'in-progress') {
            updatedOrder.inProgressTimestamp = new Date().toISOString();
          } else if (newStatus === 'completed') {
            updatedOrder.completedTimestamp = new Date().toISOString();
          }
          
          return updatedOrder;
        }
        return order;
      });
    });
  };
  
  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "Invalid time";
    }
  };
  
  // Update time elapsed function to use Vietnamese
  const getTimeElapsed = (timestamp) => {
    try {
      const orderTime = new Date(timestamp).getTime();
      const now = Date.now();
      const diffMinutes = Math.floor((now - orderTime) / 60000);
      
      if (diffMinutes < 1) return 'Vừa xong';
      if (diffMinutes === 1) return '1 phút trước';
      return `${diffMinutes} phút trước`;
    } catch (e) {
      return "Không rõ";
    }
  };
  
  // Calculate time elapsed since order was placed
  // const getTimeElapsed = (timestamp) => {
  //   try {
  //     const orderTime = new Date(timestamp).getTime();
  //     const now = Date.now();
  //     const diffMinutes = Math.floor((now - orderTime) / 60000);
      
  //     if (diffMinutes < 1) return 'Just now';
  //     if (diffMinutes === 1) return '1 minute ago';
  //     return `${diffMinutes} minutes ago`;
  //   } catch (e) {
  //     return "Unknown";
  //   }
  // };
  
  // Get appropriate status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'new': return 'error';
      case 'in-progress': return 'warning';
      case 'completed': return 'success';
      default: return 'default';
    }
  };
  
  const openNoteDialog = (note, itemName) => {
    setCurrentNote(note || '');
    setCurrentItemName(itemName);
    setNoteDialogOpen(true);
  };

  // Add this line to calculate the total revenue
  const totalRevenue = calculateTotalRevenue(filteredOrders);

  // Add this new function after your other utility functions (before the return statement)
  const calculateAverageCompletionTime = (ordersList) => {
    // Filter to only completed orders that have both timestamps
    const completedOrders = ordersList.filter(
      order => order.status === 'completed' && order.inProgressTimestamp && order.completedTimestamp
    );
    
    if (completedOrders.length === 0) return 'N/A';
    
    // For each completed order, calculate how long it took to prepare
    const totalMinutes = completedOrders.reduce((sum, order) => {
      try {
        const startTime = new Date(order.inProgressTimestamp).getTime();
        const endTime = new Date(order.completedTimestamp).getTime();
        const diffMinutes = Math.floor((endTime - startTime) / 60000);
        return sum + diffMinutes;
      } catch (e) {
        return sum;
      }
    }, 0);
    
    const avgMinutes = Math.round(totalMinutes / completedOrders.length);
    
    // Format nicely in Vietnamese
    if (avgMinutes < 60) {
      return `${avgMinutes} phút`;
    } else {
      const hours = Math.floor(avgMinutes / 60);
      const mins = avgMinutes % 60;
      return `${hours}h ${mins}p`;
    }
  };

  // Add this before return statement
  const avgCompletionTime = calculateAverageCompletionTime(filteredOrders);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false}>
        <Box sx={{ py: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Quản Lý Nhà Bếp
          </Typography>
          
          <Paper sx={{ width: '100%', mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab 
                label={
                  <Badge badgeContent={newOrdersCount} color="error" max={99}>
                    Đơn Mới
                  </Badge>
                } 
              />
              <Tab 
                label={
                  <Badge badgeContent={inProgressCount} color="warning" max={99}>
                    Đang Chế Biến
                  </Badge>
                } 
              />
              <Tab 
                label={
                  <Badge badgeContent={completedCount} color="success" max={99}>
                    Hoàn Thành
                  </Badge>
                } 
              />
              <Tab label="Tất Cả Đơn Hàng" />
            </Tabs>
          </Paper>
          
          {activeTab === 3 && (
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                Lọc Theo Ngày
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Button 
                  variant={dateFilter === 'all' ? "contained" : "outlined"} 
                  color="primary"
                  size="small"
                  onClick={() => setDateFilter('all')}
                >
                  Tất Cả
                </Button>
                <Button 
                  variant={dateFilter === 'today' ? "contained" : "outlined"} 
                  color="primary"
                  size="small"
                  onClick={() => setDateFilter('today')}
                >
                  Hôm Nay
                </Button>
                <Button 
                  variant={dateFilter === 'yesterday' ? "contained" : "outlined"} 
                  color="primary"
                  size="small"
                  onClick={() => setDateFilter('yesterday')}
                >
                  Hôm Qua
                </Button>
                <Button 
                  variant={dateFilter === 'thisWeek' ? "contained" : "outlined"} 
                  color="primary"
                  size="small"
                  onClick={() => setDateFilter('thisWeek')}
                >
                  Tuần Này
                </Button>
                <Button 
                  variant={dateFilter === 'custom' ? "contained" : "outlined"} 
                  color="primary"
                  size="small"
                  onClick={() => setDateFilter('custom')}
                >
                  Ngày Tùy Chọn
                </Button>
                
                {dateFilter === 'custom' && (
                  <TextField
                    type="date"
                    size="small"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    sx={{ ml: 1 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                )}
              </Box>
              
              {dateFilter !== 'all' && (
                <Box sx={{ mt: 1, fontSize: '0.9rem', color: 'text.secondary' }}>
                  {dateFilter === 'today' && "Hiển thị đơn hàng trong ngày hôm nay"}
                  {dateFilter === 'yesterday' && "Hiển thị đơn hàng từ hôm qua"}
                  {dateFilter === 'thisWeek' && "Hiển thị đơn hàng trong tuần này"}
                  {dateFilter === 'custom' && customDate && `Hiển thị đơn hàng vào ngày ${new Date(customDate).toLocaleDateString()}`}
                </Box>
              )}
            </Paper>
          )}
          
          {activeTab === 3 && (
            <Box sx={{ mb: 3 }}>
              <Card variant="outlined" sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography variant="overline" color="text.secondary">
                          Tổng Doanh Thu
                        </Typography>
                        <Typography variant="h4" color="primary" fontWeight="bold">
                          {totalRevenue.toLocaleString('de-DE')} vnd
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {dateFilter === 'all' ? 'Tất cả thời gian' : 
                          dateFilter === 'today' ? 'Hôm nay' :
                          dateFilter === 'yesterday' ? 'Hôm qua' :
                          dateFilter === 'thisWeek' ? 'Tuần này' :
                          dateFilter === 'custom' ? `Ngày ${new Date(customDate).toLocaleDateString()}` : ''}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Grid container spacing={2}>
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="overline" color="text.secondary">
                              Đơn Hàng
                            </Typography>
                            <Typography variant="h6">
                              {filteredOrders.length}
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="overline" color="text.secondary">
                              Món Đã Bán
                            </Typography>
                            <Typography variant="h6">
                              {filteredOrders.reduce((total, order) => {
                                return total + (order.items ? 
                                  order.items.reduce((sum, item) => sum + item.quantity, 0) : 0);
                              }, 0)}
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="overline" color="text.secondary">
                              Giá Trị TB
                            </Typography>
                            <Typography variant="h6">
                              {filteredOrders.length > 0 ? 
                                Math.round(totalRevenue / filteredOrders.length).toLocaleString('de-DE') : 0} vnd
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={6} sm={3}>
                          <Box sx={{ 
                            textAlign: 'center',
                            borderLeft: { xs: 'none', sm: '1px dashed rgba(0,0,0,0.1)' },
                            pl: { xs: 0, sm: 2 }
                          }}>
                            <Typography variant="overline" color="text.secondary">
                              Thời Gian TB
                            </Typography>
                            <Typography variant="h6" color={avgCompletionTime === 'N/A' ? 'text.secondary' : 'text.primary'}>
                              {avgCompletionTime}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              để hoàn thành
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}
          
          {filteredOrders.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="h6" color="text.secondary">
                {activeTab === 3 && dateFilter !== 'all' 
                  ? 'Không tìm thấy đơn hàng cho ngày đã chọn' 
                  : 'Không có đơn hàng trong mục này'}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredOrders.map((order, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      mb: 2,
                      borderLeft: 5,
                      borderColor: theme.palette[getStatusColor(order.status)].main
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 1 }}>
                            {order.tableNumber}
                          </Avatar>
                          <Typography variant="h6">
                            Table {order.tableNumber}
                          </Typography>
                        </Box>
                        
                        <Box>
                          <Chip 
                            label={order.status ? order.status.toUpperCase() : 'NEW'} 
                            color={getStatusColor(order.status)}
                            size="small"
                          />
                          <Typography variant="caption" display="block" sx={{ textAlign: 'right', mt: 0.5 }}>
                            {getTimeElapsed(order.timestamp)}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ mb: 2 }} />
                      
                      <List dense>
                        {order.items && order.items.map((item, idx) => (
                          <ListItem 
                            key={`${idx}-${item.name}`} 
                            disablePadding 
                            sx={{ 
                              py: 0.5,
                              borderLeft: item.notes ? '3px solid #ff9800' : 'none',
                              pl: item.notes ? 1 : 0,
                              bgcolor: item.notes ? 'rgba(255,152,0,0.05)' : 'transparent',
                              borderRadius: 1
                            }}
                          >
                            <ListItemText 
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Box component="span" sx={{ fontWeight: 'bold', mr: 0.5 }}>
                                    {item.quantity}×
                                  </Box>
                                  {item.name}
                                  
                                  {item.notes && (
                                    <Tooltip title="View special instructions">
                                      <IconButton 
                                        size="small" 
                                        color="warning" 
                                        onClick={() => openNoteDialog(item.notes, item.name)}
                                        sx={{ ml: 1, p: 0.5 }}
                                      >
                                        <NoteIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                </Box>
                              }
                              secondary={item.notes ? (
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    fontStyle: 'italic',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontSize: '0.8rem',
                                    color: 'text.secondary',
                                    mt: 0.5
                                  }}
                                >
                                  "{item.notes}"
                                </Typography>
                              ) : null}
                            />
                            <Typography>
                              {item.price.toLocaleString('de-DE')} vnd
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        mt: 2, 
                        pt: 1, 
                        borderTop: '1px dashed rgba(0,0,0,0.1)' 
                      }}>
                        <Typography variant="body2" color="text.secondary">
                          Thời gian: {formatTime(order.timestamp)}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          Món: {order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 0}
                        </Typography>
                      </Box>
                    </CardContent>
                    
                    <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                      {order.status === 'new' && (
                        <Button 
                          variant="contained"
                          size="small"
                          startIcon={<PlayArrowIcon />}
                          onClick={() => updateOrderStatus(order, "in-progress")}
                          sx={{ 
                            mt: 1,
                            backgroundColor: "#81cd28", // Explicitly set background color
                            '&:hover': {
                              backgroundColor: "#6db122" // Slightly darker shade for hover state
                            }
                          }}
                        >
                          Bắt Đầu Chế Biến
                        </Button>
                      )}
                      
                      {order.status === 'in-progress' && (
                        <Button 
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => updateOrderStatus(order, 'completed')}
                        >
                          Đã Hoàn Thành
                        </Button>
                      )}
                      
                      {order.status === 'completed' && (
                        <Button 
                          size="small"
                          variant="outlined"
                          onClick={() => updateOrderStatus(order, 'new')}
                        >
                          Mở Lại Đơn
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          
          {/* Navigation button back to menu */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button 
              variant="outlined"
              onClick={() => navigate('/landing')}
            >
              Quay Lại Thực Đơn
            </Button>
          </Box>
        </Box>
      </Container>

      <Dialog 
        open={noteDialogOpen} 
        onClose={() => setNoteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Yêu Cầu Đặc Biệt cho {currentItemName}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ 
            p: 2, 
            bgcolor: 'rgba(255,152,0,0.05)', 
            border: '1px dashed #ff9800',
            borderRadius: 1,
            mt: 1
          }}>
            <Typography variant="body1">
              {currentNote || "Không có yêu cầu đặc biệt."}
            </Typography>
          </Box>
          
          {/* Kitchen staff can add their own notes in response */}
          <TextField
            margin="normal"
            id="kitchen-note"
            label="Thêm ghi chú nhà bếp (tùy chọn)"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            placeholder="Thêm hướng dẫn cho nhân viên hoặc phản hồi yêu cầu của khách hàng"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteDialogOpen(false)} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default Admin;


