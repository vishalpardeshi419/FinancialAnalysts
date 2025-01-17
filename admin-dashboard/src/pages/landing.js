// LandingPage.jsx
import React, {useEffect, useState} from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';

const LandingPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (provider) => {
    window.location.href = `http://localhost:5500/auth/${provider}`;
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      const userData = jwtDecode(token);
      setUser(userData);
      navigate("/dashboard");
    }
  }, []);
  return (
    <Container>
      <Header>
        <Logo>FinanceDash</Logo>
        <Nav>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
          <NavLink href="#contact">Contact</NavLink>
          <h1>OAuth Login</h1>
          {user ? (
            <div>
              <p>Welcome, {user.name}</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div>
              <button onClick={() => handleLogin("google")}>Login with Google</button>
              {/* <button onClick={() => handleLogin("microsoft")}>
                Login with Microsoft
              </button> */}
            </div>
          )}
        </Nav>
      </Header>
      <HeroSection>
        <HeroText>
          <h1>Streamline Your Subscription Management</h1>
          <p>Manage billing cycles, monitor revenue, and handle recognition with ease.</p>
          <HeroButtons>
            <PrimaryButton href="/get-started">Get Started</PrimaryButton>
            <SecondaryButton href="#features">Learn More</SecondaryButton>
          </HeroButtons>
        </HeroText>
        <HeroImage
          src="https://via.placeholder.com/600x400"
          alt="Finance Dashboard Illustration"
        />
      </HeroSection>
      <FeaturesSection id="features">
        <h2>Features</h2>
        <FeaturesGrid>
          <FeatureCard>
            <h3>Subscription Management</h3>
            <p>Easily create and manage subscription plans for your customers.</p>
          </FeatureCard>
          <FeatureCard>
            <h3>Billing Tracking</h3>
            <p>Stay on top of your billing cycles and ensure accuracy.</p>
          </FeatureCard>
          <FeatureCard>
            <h3>Revenue Metrics</h3>
            <p>Monitor revenue trends and generate actionable insights.</p>
          </FeatureCard>
          <FeatureCard>
            <h3>Revenue Recognition</h3>
            <p>Automate revenue recognition with compliance in mind.</p>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>
      <Footer>
        <p>© 2025 FinanceDash. All rights reserved.</p>
      </Footer>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  font-family: Arial, sans-serif;
  line-height: 1.6;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #282c34;
  color: #fff;
`;

const Logo = styled.h1`
  font-size: 1.5rem;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
`;

const NavLink = styled.a`
  color: #fff;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Button = styled.a`
  background: #61dafb;
  color: #282c34;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  text-decoration: none;

  &:hover {
    background: #21a1f1;
  }
`;

const HeroSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  background: #f5f5f5;
`;

const HeroText = styled.div`
  max-width: 50%;
`;

const HeroButtons = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
`;

const PrimaryButton = styled.a`
  background: #61dafb;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  text-decoration: none;

  &:hover {
    background: #21a1f1;
  }
`;

const SecondaryButton = styled.a`
  background: #282c34;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  text-decoration: none;

  &:hover {
    background: #000;
  }
`;

const HeroImage = styled.img`
  max-width: 40%;
`;

const FeaturesSection = styled.section`
  padding: 2rem;
  background: #fff;

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const FeatureCard = styled.div`
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    margin-top: 0;
  }
`;

const Footer = styled.footer`
  padding: 1rem;
  text-align: center;
  background: #282c34;
  color: #fff;
`;

export default LandingPage;
