// Certificate Generation System - Generate completion certificates
class CertificateSystem {
    constructor() {
        this.storageManager = window.StorageManager;
        this.certificates = [];
        this.init();
    }

    init() {
        this.createCertificatePanel();
        this.loadCertificates();
        this.checkEligibility();
    }

    createCertificatePanel() {
        if (document.getElementById('certificate-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'certificate-panel';
        panel.className = 'certificate-panel';
        panel.innerHTML = `
            <div class="cert-header">
                <h4>🏆 Certificates</h4>
                <button id="toggle-cert-panel" class="toggle-btn">−</button>
            </div>
            <div class="cert-content">
                <div class="cert-actions">
                    <button id="generate-cert" class="cert-btn primary">📜 Generate Certificate</button>
                    <button id="view-certs" class="cert-btn secondary">👀 View Certificates</button>
                    <button id="check-eligibility" class="cert-btn secondary">✅ Check Eligibility</button>
                </div>
                <div id="cert-display" class="cert-display">
                    <p class="cert-intro">🎓 Complete courses to earn certificates!</p>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        this.setupPanelListeners();
    }

    setupPanelListeners() {
        document.getElementById('toggle-cert-panel').addEventListener('click', () => {
            const panel = document.getElementById('certificate-panel');
            panel.classList.toggle('collapsed');
        });

        document.getElementById('generate-cert').addEventListener('click', () => this.showGenerateOptions());
        document.getElementById('view-certs').addEventListener('click', () => this.viewCertificates());
        document.getElementById('check-eligibility').addEventListener('click', () => this.checkEligibility());
    }

    showGenerateOptions() {
        const display = document.getElementById('cert-display');
        const eligibleCerts = this.getEligibleCertificates();
        
        if (eligibleCerts.length === 0) {
            display.innerHTML = `
                <div class="no-eligible">
                    <h4>📚 No Certificates Available</h4>
                    <p>Complete more challenges to earn certificates!</p>
                    <div class="requirements">
                        <h5>Requirements:</h5>
                        <ul>
                            <li>HTML Basics: Complete 8/10 challenges</li>
                            <li>CSS Styling: Complete 8/10 challenges</li>
                            <li>JavaScript: Complete 10/15 challenges</li>
                            <li>Full Stack: Complete all categories</li>
                        </ul>
                    </div>
                </div>
            `;
            return;
        }

        display.innerHTML = `
            <div class="generate-options">
                <h4>📜 Available Certificates</h4>
                <div class="cert-options">
                    ${eligibleCerts.map(cert => `
                        <div class="cert-option">
                            <div class="cert-info">
                                <h5>${cert.title}</h5>
                                <p>${cert.description}</p>
                                <div class="cert-progress">
                                    Progress: ${cert.progress}% complete
                                </div>
                            </div>
                            <button onclick="window.certificateSystem.generateCertificate('${cert.type}')" class="generate-btn">Generate</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    getEligibleCertificates() {
        const progress = this.getProgress();
        const eligible = [];

        // HTML Certificate
        if (progress.html >= 80) {
            eligible.push({
                type: 'html',
                title: 'HTML Fundamentals Certificate',
                description: 'Mastery of HTML structure and elements',
                progress: progress.html
            });
        }

        // CSS Certificate
        if (progress.css >= 80) {
            eligible.push({
                type: 'css',
                title: 'CSS Styling Certificate',
                description: 'Proficiency in CSS design and layout',
                progress: progress.css
            });
        }

        // JavaScript Certificate
        if (progress.js >= 70) {
            eligible.push({
                type: 'javascript',
                title: 'JavaScript Programming Certificate',
                description: 'Competency in JavaScript development',
                progress: progress.js
            });
        }

        // Full Stack Certificate
        if (progress.html >= 90 && progress.css >= 90 && progress.js >= 85) {
            eligible.push({
                type: 'fullstack',
                title: 'Full Stack Web Development Certificate',
                description: 'Complete mastery of web development',
                progress: Math.round((progress.html + progress.css + progress.js) / 3)
            });
        }

        return eligible;
    }

    generateCertificate(type) {
        const certData = this.createCertificateData(type);
        this.saveCertificate(certData);
        this.displayCertificate(certData);
    }

    createCertificateData(type) {
        const profile = this.storageManager?.get('profile') || {};
        const userName = profile.username || 'Student';
        const progress = this.getProgress();
        
        const certTypes = {
            html: {
                title: 'HTML Fundamentals Certificate',
                subtitle: 'Web Structure and Markup',
                skills: ['Semantic HTML', 'Forms & Inputs', 'Accessibility', 'Document Structure'],
                color: '#e53e3e'
            },
            css: {
                title: 'CSS Styling Certificate',
                subtitle: 'Design and Layout Mastery',
                skills: ['Responsive Design', 'Flexbox & Grid', 'Animations', 'Modern CSS'],
                color: '#38b2ac'
            },
            javascript: {
                title: 'JavaScript Programming Certificate',
                subtitle: 'Interactive Web Development',
                skills: ['ES6+ Features', 'DOM Manipulation', 'Event Handling', 'Async Programming'],
                color: '#ed8936'
            },
            fullstack: {
                title: 'Full Stack Web Development Certificate',
                subtitle: 'Complete Web Development Mastery',
                skills: ['Frontend Development', 'Backend Integration', 'Database Design', 'Deployment'],
                color: '#667eea'
            }
        };

        const certInfo = certTypes[type];
        
        return {
            id: 'cert_' + Date.now().toString(36),
            type,
            title: certInfo.title,
            subtitle: certInfo.subtitle,
            recipientName: userName,
            skills: certInfo.skills,
            completionDate: new Date().toLocaleDateString(),
            issueDate: Date.now(),
            progress: progress[type] || 100,
            color: certInfo.color,
            certificateNumber: this.generateCertificateNumber()
        };
    }

    generateCertificateNumber() {
        const prefix = 'CQ';
        const year = new Date().getFullYear();
        const random = Math.random().toString(36).substr(2, 6).toUpperCase();
        return `${prefix}${year}${random}`;
    }

    displayCertificate(certData) {
        const display = document.getElementById('cert-display');
        display.innerHTML = `
            <div class="certificate-preview">
                <div class="certificate" id="certificate-${certData.id}" style="border-color: ${certData.color}">
                    <div class="cert-header-design" style="background: ${certData.color}">
                        <div class="cert-logo">🏆</div>
                        <h2>Certificate of Completion</h2>
                    </div>
                    
                    <div class="cert-body">
                        <div class="cert-title">${certData.title}</div>
                        <div class="cert-subtitle">${certData.subtitle}</div>
                        
                        <div class="cert-recipient">
                            <p>This is to certify that</p>
                            <h3>${certData.recipientName}</h3>
                            <p>has successfully completed the requirements for</p>
                        </div>
                        
                        <div class="cert-skills">
                            <h4>Skills Demonstrated:</h4>
                            <ul>
                                ${certData.skills.map(skill => `<li>${skill}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="cert-footer">
                            <div class="cert-date">
                                <strong>Completion Date:</strong> ${certData.completionDate}
                            </div>
                            <div class="cert-number">
                                <strong>Certificate #:</strong> ${certData.certificateNumber}
                            </div>
                            <div class="cert-score">
                                <strong>Score:</strong> ${certData.progress}%
                            </div>
                        </div>
                        
                        <div class="cert-signature">
                            <div class="signature-line">
                                <div class="signature">CodeQuest Academy</div>
                                <div class="signature-title">Learning Platform</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="cert-actions">
                    <button onclick="window.certificateSystem.downloadCertificate('${certData.id}')" class="download-btn">📥 Download PDF</button>
                    <button onclick="window.certificateSystem.shareCertificate('${certData.id}')" class="share-btn">🔗 Share</button>
                    <button onclick="window.certificateSystem.printCertificate('${certData.id}')" class="print-btn">🖨️ Print</button>
                </div>
            </div>
        `;
    }

    downloadCertificate(certId) {
        const cert = this.certificates.find(c => c.id === certId);
        if (!cert) return;

        // Create downloadable content
        const certElement = document.getElementById(`certificate-${certId}`);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = 800;
        canvas.height = 600;
        
        // Create certificate image
        this.drawCertificateOnCanvas(ctx, cert, canvas.width, canvas.height);
        
        // Download as image
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${cert.title.replace(/\s+/g, '_')}_Certificate.png`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    drawCertificateOnCanvas(ctx, cert, width, height) {
        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        
        // Border
        ctx.strokeStyle = cert.color;
        ctx.lineWidth = 8;
        ctx.strokeRect(20, 20, width - 40, height - 40);
        
        // Header
        ctx.fillStyle = cert.color;
        ctx.fillRect(40, 40, width - 80, 80);
        
        // Title
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Certificate of Completion', width / 2, 90);
        
        // Certificate title
        ctx.fillStyle = '#333333';
        ctx.font = 'bold 20px Arial';
        ctx.fillText(cert.title, width / 2, 160);
        
        // Recipient name
        ctx.font = 'bold 28px Arial';
        ctx.fillStyle = cert.color;
        ctx.fillText(cert.recipientName, width / 2, 220);
        
        // Completion text
        ctx.fillStyle = '#666666';
        ctx.font = '16px Arial';
        ctx.fillText('has successfully completed the requirements', width / 2, 260);
        
        // Skills
        ctx.textAlign = 'left';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('Skills Demonstrated:', 60, 320);
        
        cert.skills.forEach((skill, index) => {
            ctx.font = '12px Arial';
            ctx.fillText(`• ${skill}`, 80, 345 + (index * 20));
        });
        
        // Footer info
        ctx.textAlign = 'center';
        ctx.font = '12px Arial';
        ctx.fillText(`Completion Date: ${cert.completionDate}`, width / 2, height - 80);
        ctx.fillText(`Certificate #: ${cert.certificateNumber}`, width / 2, height - 60);
        ctx.fillText(`Score: ${cert.progress}%`, width / 2, height - 40);
    }

    shareCertificate(certId) {
        const cert = this.certificates.find(c => c.id === certId);
        if (!cert) return;

        const shareText = `I just earned my ${cert.title} from CodeQuest! 🎓 #CodeQuest #WebDevelopment #Certificate`;
        const shareUrl = `${window.location.origin}?cert=${certId}`;

        if (navigator.share) {
            navigator.share({
                title: cert.title,
                text: shareText,
                url: shareUrl
            });
        } else {
            navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
                this.showMessage('Certificate link copied to clipboard!', 'success');
            });
        }
    }

    printCertificate(certId) {
        const certElement = document.getElementById(`certificate-${certId}`);
        if (!certElement) return;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Certificate</title>
                    <style>
                        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                        .certificate { max-width: 800px; margin: 0 auto; }
                        @media print { body { margin: 0; } }
                    </style>
                </head>
                <body>
                    ${certElement.outerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }

    viewCertificates() {
        const display = document.getElementById('cert-display');
        
        if (this.certificates.length === 0) {
            display.innerHTML = `
                <div class="no-certificates">
                    <h4>📜 No Certificates Yet</h4>
                    <p>Complete challenges to earn your first certificate!</p>
                </div>
            `;
            return;
        }

        display.innerHTML = `
            <div class="certificates-list">
                <h4>🏆 Your Certificates</h4>
                <div class="certs-grid">
                    ${this.certificates.map(cert => `
                        <div class="cert-card">
                            <div class="cert-card-header" style="background: ${cert.color}">
                                <h5>${cert.title}</h5>
                                <div class="cert-badge">🏆</div>
                            </div>
                            <div class="cert-card-body">
                                <p><strong>Recipient:</strong> ${cert.recipientName}</p>
                                <p><strong>Completed:</strong> ${cert.completionDate}</p>
                                <p><strong>Score:</strong> ${cert.progress}%</p>
                                <p><strong>Certificate #:</strong> ${cert.certificateNumber}</p>
                            </div>
                            <div class="cert-card-actions">
                                <button onclick="window.certificateSystem.displayCertificate(${JSON.stringify(cert).replace(/"/g, '&quot;')})" class="view-cert-btn">View</button>
                                <button onclick="window.certificateSystem.downloadCertificate('${cert.id}')" class="download-cert-btn">Download</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    checkEligibility() {
        const display = document.getElementById('cert-display');
        const progress = this.getProgress();
        const eligible = this.getEligibleCertificates();
        
        display.innerHTML = `
            <div class="eligibility-check">
                <h4>✅ Certificate Eligibility</h4>
                <div class="progress-overview">
                    <div class="progress-item">
                        <span class="progress-label">HTML:</span>
                        <div class="progress-bar-small">
                            <div class="progress-fill-small" style="width: ${progress.html}%"></div>
                        </div>
                        <span class="progress-percent">${progress.html}%</span>
                        <span class="eligibility-status ${progress.html >= 80 ? 'eligible' : 'not-eligible'}">
                            ${progress.html >= 80 ? '✅ Eligible' : '❌ Need 80%'}
                        </span>
                    </div>
                    
                    <div class="progress-item">
                        <span class="progress-label">CSS:</span>
                        <div class="progress-bar-small">
                            <div class="progress-fill-small" style="width: ${progress.css}%"></div>
                        </div>
                        <span class="progress-percent">${progress.css}%</span>
                        <span class="eligibility-status ${progress.css >= 80 ? 'eligible' : 'not-eligible'}">
                            ${progress.css >= 80 ? '✅ Eligible' : '❌ Need 80%'}
                        </span>
                    </div>
                    
                    <div class="progress-item">
                        <span class="progress-label">JavaScript:</span>
                        <div class="progress-bar-small">
                            <div class="progress-fill-small" style="width: ${progress.js}%"></div>
                        </div>
                        <span class="progress-percent">${progress.js}%</span>
                        <span class="eligibility-status ${progress.js >= 70 ? 'eligible' : 'not-eligible'}">
                            ${progress.js >= 70 ? '✅ Eligible' : '❌ Need 70%'}
                        </span>
                    </div>
                </div>
                
                <div class="eligible-summary">
                    <p><strong>Available Certificates:</strong> ${eligible.length}</p>
                    ${eligible.length > 0 ? '<p>🎉 You can generate certificates now!</p>' : '<p>Keep learning to unlock certificates!</p>'}
                </div>
            </div>
        `;
    }

    getProgress() {
        // Simulate progress based on stored data
        const progressData = this.storageManager?.get('progress') || {};
        return {
            html: Math.min(100, (progressData.html?.completed || 0) * 10),
            css: Math.min(100, (progressData.css?.completed || 0) * 10),
            js: Math.min(100, (progressData.js?.completed || 0) * 6)
        };
    }

    saveCertificate(certData) {
        this.certificates.push(certData);
        this.storageManager?.set('certificates', this.certificates);
    }

    loadCertificates() {
        this.certificates = this.storageManager?.get('certificates') || [];
    }

    showMessage(text, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'cert-notification';
        notification.innerHTML = `
            <div class="cert-message ${type}">
                <span>${text}</span>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// Initialize certificate system
document.addEventListener('DOMContentLoaded', () => {
    window.certificateSystem = new CertificateSystem();
});