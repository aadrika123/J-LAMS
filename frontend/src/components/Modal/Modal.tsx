
// import React, { useEffect } from 'react';
// import styles from './Modal.module.css';

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
//   useEffect(() => {
//     if (isOpen) {
//       console.log("Modal is opened");
//       const modalElement = document.getElementById('modal-content');
//       modalElement?.focus();
//     } else {
//       console.log("Modal is closed");
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   const handleClose = () => {
//     const result = onClose(); // Call onClose and store the result
//     console.log('onClose returned:', result); // Log the returned value
//     return result; // Return the value
//   };

//   // Static content
//   const content = {
//     type: 'pdf', // Change to 'image' for testing the image display
//     src: 'https://aadrikainfomedia.com/dms/uploads/1730118221629-119255049.pdf' // Replace with an image URL if needed
//   };

//   return (
//     <div className={styles.modalOverlay} onClick={handleClose}>
//       <div 
//         id="modal-content"
//         className={styles.modalContent} 
//         onClick={(e) => e.stopPropagation()} 
//         tabIndex={0} // Make the modal focusable
//       >
//         <button onClick={handleClose} className={styles.closeButton}>Close</button>
//         {content.type === 'pdf' ? (
//           <iframe 
//             src={content.src} 
//             style={{ width: '100%', height: '100%' }} 
//             title="PDF content"
//           />
//         ) : (
//           <img 
//             src={content.src} 
//             alt="modal content" 
//             style={{ width: '100%', height: 'auto' }} // Maintain aspect ratio
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Modal;


import React, { useEffect } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: {
    type: 'image' | 'pdf';
    src: string;
  };
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, content }) => {
  useEffect(() => {
    if (isOpen) {
      console.log("Modal is opened");
      const modalElement = document.getElementById('modal-content');
      modalElement?.focus();
    } else {
      console.log("Modal is closed");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    const result = onClose();
    console.log('onClose returned:', result);
    return result;
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div 
        id="modal-content"
        className={styles.modalContent} 
        onClick={(e) => e.stopPropagation()} 
        tabIndex={0}
      >
        <button onClick={handleClose} className={styles.closeButton}>X</button>
        {content?.type === 'pdf' ? (
          <iframe 
            src={content.src} 
            style={{ width: '100%', height: '100%', border: 'none' }} 
            title="PDF content"
          />
        ) : (
          <img 
            src={content?.src} 
            alt="modal content" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          />
        )}
      </div>
    </div>
  );
};

export default Modal;
