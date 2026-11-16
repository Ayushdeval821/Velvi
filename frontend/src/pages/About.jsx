import React from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaAward, FaSeedling, FaMapMarkerAlt } from 'react-icons/fa';

const About = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center text-center mb-5">
        <div className="col-lg-8">
          <p className="kicker">Our Heritage</p>
          <h1 className="display-5 fw-bold mb-3" style={{ color: 'var(--forest)' }}>
            About VELVI NATURALS
          </h1>
          <p className="lead text-muted">
            VELVI NATURALS PRIVATE LIMITED is based in Bareilly, Uttar Pradesh. The company is dedicated to offering pure, natural, and convenient sweetening solutions for modern health-conscious lifestyles.
          </p>
        </div>
      </div>

      <div className="row g-5 align-items-center mb-5">
        <div className="col-lg-6">
          <img
            src="/stevia-drop.jpg"
            alt="VELVI NATURALS Stevia Drop"
            className="img-fluid rounded-4 shadow-sm w-100"
            style={{ maxHeight: '450px', objectFit: 'contain', background: 'var(--cream)' }}
          />
        </div>
        <div className="col-lg-6">
          <h2 className="h3 fw-bold mb-3" style={{ color: 'var(--forest)' }}>
            Natural Sweetness, Pure Experience
          </h2>
          <p className="text-muted">
            The brand presents <strong>Stevia Drop</strong>, a liquid sweetener packed in a compact 10 ml dropper bottle, for individuals seeking a clean, calorie-free way to sweeten their everyday drinks and meals.
          </p>
          <p className="text-muted">
            The pack is small, portable, and simple to handle. Whether at home, in the office, or travelling, you can effortlessly enjoy plant-based sweetness without artificial aftertastes.
          </p>
          <div className="p-3 rounded-3 mt-4" style={{ background: 'var(--cream)' }}>
            <div className="d-flex align-items-center gap-2 mb-1">
              <FaMapMarkerAlt className="text-success" />
              <strong className="text-dark">Registered Office</strong>
            </div>
            <p className="text-muted small m-0">
              354, Jawahar Nagar, Bareilly, Uttar Pradesh - 243001, India.
            </p>
          </div>
        </div>
      </div>

      {/* Core values */}
      <div className="row g-4 text-center mt-3">
        <div className="col-md-4">
          <div className="card p-4 border-0 rounded-4 shadow-sm bg-white h-100">
            <FaLeaf size={36} className="text-success mb-3 mx-auto" />
            <h5 className="fw-bold">Plant-Based Purity</h5>
            <p className="text-muted small m-0">Sourced from quality stevia leaf extracts with natural origin integrity.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-4 border-0 rounded-4 shadow-sm bg-white h-100">
            <FaAward size={36} className="text-success mb-3 mx-auto" />
            <h5 className="fw-bold">Hygienic Packaging</h5>
            <p className="text-muted small m-0">Prepared in compliance with strict sanitary food packaging standards.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-4 border-0 rounded-4 shadow-sm bg-white h-100">
            <FaSeedling size={36} className="text-success mb-3 mx-auto" />
            <h5 className="fw-bold">Zero-Sugar Companion</h5>
            <p className="text-muted small m-0">Ideal for those looking to cut refined table sugar from their regular diet.</p>
          </div>
        </div>
      </div>

      <div className="text-center mt-5">
        <Link to="/shop" className="btn btn-velvi btn-lg">
          Explore Our Products
        </Link>
      </div>
    </div>
  );
};

export default About;
