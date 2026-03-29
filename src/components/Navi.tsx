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
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";
import { useThemeContext } from "../contexts/ThemeContext";

export function Navi() {
  const { user, signOut } = useAuth();
  const { displayName } = useProfile();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeContext();

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

  const publicLinks = [
    { text: "Главная", to: "/" },
    { text: "О сайте", to: "/about" },
  ];

  const createLink = displayName
    ? { text: "Добавить впечатление", to: "/create" }
    : null;

  const navLinks = user
    ? [...publicLinks, createLink].filter(Boolean)
    : publicLinks;

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
            key={link!.text}
            component={RouterLink}
            to={link!.to}
            onClick={handleNavClick}
          >
            <ListItemText primary={link!.text} />
          </ListItemButton>
        ))}
        {/* Переключатель темы в мобильном меню (для всех) */}
        <ListItemButton
          onClick={() => {
            toggleTheme();
            handleNavClick();
          }}
        >
          <ListItemIcon>
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </ListItemIcon>
          <ListItemText
            primary={mode === "dark" ? "Светлая тема" : "Тёмная тема"}
          />
        </ListItemButton>
        {user && (
          <>
            <ListItemButton
              onClick={() => {
                navigate("/profile");
                handleNavClick();
              }}
            >
              <ListItemText
                primary={`Йоу${displayName ? `, ${displayName} 🚗` : ". NONAME USER??🧐"}`}
              />
            </ListItemButton>
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Выйти" />
            </ListItemButton>
          </>
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
    </Box>
  );

  return (
    <AppBar position="static" sx={{ bgcolor: "hsla(0, 0%, 3%, 1.00)" }}>
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
          🏁__🚗__🚗____🚗...Vr🛞🛞mSocial
        </Typography>

        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {publicLinks.map((link) => (
              <Button
                key={link.text}
                color="inherit"
                component={RouterLink}
                to={link.to}
              >
                {link.text}
              </Button>
            ))}
            {user && createLink && (
              <Button color="inherit" component={RouterLink} to={createLink.to}>
                {createLink.text}
              </Button>
            )}
            {/* Переключатель темы для десктопа (для всех) */}
            <IconButton color="inherit" onClick={toggleTheme} sx={{ ml: 1 }}>
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            {user ? (
              <>
                <Typography
                  variant="body2"
                  sx={{ color: "white", cursor: "pointer" }}
                  onClick={() => navigate("/profile")}
                >
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
