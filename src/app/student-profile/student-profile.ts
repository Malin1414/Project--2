document.addEventListener("DOMContentLoaded", () => {
  // ===== Change Password Feature =====
  const changePasswordBtn = document.getElementById("change-password-btn") as HTMLButtonElement | null;
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener("click", () => {
      alert("Redirecting to change password page...");
      // window.location.href = "change-password.html";
    });
  }

  // ===== Change Profile Picture Feature =====
  const changeProfilePicBtn = document.getElementById("change-profile-pic-btn") as HTMLButtonElement | null;
  const uploadProfilePic = document.getElementById("upload-profile-pic") as HTMLInputElement | null;
  const profilePicDiv = document.getElementById("profile-pic") as HTMLDivElement | null;

  if (changeProfilePicBtn && uploadProfilePic && profilePicDiv) {
    // Open file selector on button click
    changeProfilePicBtn.addEventListener("click", () => {
      uploadProfilePic.click();
    });

    // Preview selected image and save in localStorage
    uploadProfilePic.addEventListener("change", (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files ? target.files[0] : null;

      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
          const result = e.target?.result as string;
          profilePicDiv.style.backgroundImage = `url('${result}')`;

          // Save to local storage (Temporary)
          localStorage.setItem("profilePic", result);
        };

        reader.readAsDataURL(file);
      }
    });

    // Load saved profile picture from local storage on page load
    const savedPic = localStorage.getItem("profilePic");
    if (savedPic) {
      profilePicDiv.style.backgroundImage = `url('${savedPic}')`;
    }
  }
});
