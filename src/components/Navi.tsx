import { useState } from "react";
import { NavLink as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { ListItemButton } from "@mui/material";

export function Navi() {
  const { user, signOut } = useAuth();
  const { displayName } = useProfile();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // <600px
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    signOut();
    if (isMobile) setDrawerOpen(false);
    navigate("/login");
  };

  const handleNavClick = () => {
    if (isMobile) setDrawerOpen(false);
  };

  // Ссылки для всех пользователей
  const publicLinks = [
    { text: "Главная", to: "/" },
    { text: "О сайте", to: "/about" },
  ];

  // Ссылки для авторизованных пользователей
  const privateLinks = [
    { text: "Профиль", to: "/profile" },
    { text: "Добавить впечатление", to: "/create" },
  ];

  // Все ссылки (в зависимости от авторизации)
  const navLinks = user ? [...publicLinks, ...privateLinks] : publicLinks;

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navLinks.map((link) => (
          <ListItemButton
            key={link.text}
            component={RouterLink}
            to={link.to}
            onClick={handleNavClick}
          >
            <ListItemText primary={link.text} />
          </ListItemButton>
        ))}
        {user && (
          <ListItemButton onClick={handleLogout}>
            <ListItemText primary="Выйти" />
          </ListItemButton>
        )}
        {!user && (
          <ListItemButton
            component={RouterLink}
            to="/login"
            onClick={handleNavClick}
          >
            <ListItemText primary="Войти" />
          </ListItemButton>
        )}
      </List>
      {user && (
        <Typography variant="body2" sx={{ p: 2, textAlign: "center" }}>
          Йоу
          {displayName
            ? `, ${displayName} 🚗`
            : ". NONAME USER??🧐 Скорее заполни профиль и делись впечатлениями!"}
        </Typography>
      )}
    </Box>
  );

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "inherit",
            cursor: "pointer",
          }}
        >
          Vr🛞🛞mSocial
        </Typography>

        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {navLinks.map((link) => (
              <Button
                key={link.text}
                color="inherit"
                component={RouterLink}
                to={link.to}
              >
                {link.text}
              </Button>
            ))}
            {user ? (
              <>
                <Typography variant="body2" sx={{ color: "white" }}>
                  Йоу{displayName ? `, ${displayName} 🚗` : ". NONAME USER??🧐"}
                </Typography>
                <Button color="inherit" onClick={signOut}>
                  Выйти
                </Button>
              </>
            ) : (
              <Button color="inherit" component={RouterLink} to="/login">
                Войти
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </AppBar>
  );
}
