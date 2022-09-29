import "./OverlayLoader.css";

const OverlayLoader = () => {
  return (
    <div class="overlayLoader">
      <button type="button" class="bg-indigo-500 ..." disabled>
        <svg class="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24"></svg>
        Processing...
      </button>
    </div>
  );
};

export default OverlayLoader;
