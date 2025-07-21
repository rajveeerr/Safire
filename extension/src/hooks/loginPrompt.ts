export const addLoginPrompt = () => {
    const bottomElement = document.querySelector('.msg-s-message-list__bottom-of-list');
    if (!bottomElement || document.getElementById('login-prompt')) return;

    const loginPrompt = document.createElement('div');
    loginPrompt.id = 'login-prompt';
    loginPrompt.innerHTML = `
        <div style="
            display: flex; 
            align-items: center; 
            gap: 8px; 
            padding: 8px 12px; 
            background: rgba(34, 197, 94, 0.1);
            border-radius: 6px; 
            font-size: 14px;
        ">
            <span style="color: #22c55e; flex: 1;">Want to save your messages?</span>
            <a href="https://dashboard-azure-one.vercel.app/auth/sign-in?source=extension" 
               style="color: #fff; background: #22c55e; padding: 4px 10px; border-radius: 4px; 
                      text-decoration: none; font-weight: bold; transition: background 0.3s ease;"
               onmouseover="this.style.background='#16a34a'"
               onmouseout="this.style.background='#22c55e'">
                Login
            </a>
        </div>
    `;
    bottomElement.appendChild(loginPrompt);
};
