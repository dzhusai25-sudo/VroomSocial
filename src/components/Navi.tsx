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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";

export function Navi() {
  const { user, signOut } = useAuth();
  const { displayName } = useProfile();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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

  // Общие ссылки для всех
  const publicLinks = [
    { text: "Главная", to: "/" },
    { text: "О сайте", to: "/about" },
  ];

  // Ссылка для добавления впечатления (только если есть имя)
  const createLink = displayName ? { text: "Добавить впечатление", to: "/create" } : null;

  // Все ссылки для мобильного меню (без отдельного пункта "Профиль")
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
        {user && (
          <>
            {/* Приветствие как ссылка на профиль */}
            <ListItemButton onClick={() => { navigate("/profile"); handleNavClick(); }}>
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