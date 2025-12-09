const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    // 1. Setup
    const browser = await puppeteer.launch({
        headless: "new", // or true, depending on version
        defaultViewport: { width: 1366, height: 768 }
    });
    const page = await browser.newPage();
    const headers = { 'Cache-Control': 'no-cache' };
    await page.setExtraHTTPHeaders(headers);

    const baseUrl = 'file:///C:/xampp/htdocs/MOCKUP-COTIZACION'; // Local file access
    // OR if you were running a server: 'http://localhost/MOCKUP-COTIZACION';
    // Since we are just files, we use file protocol or assume server if running. 
    // Given XAMPP path, let's try to assume file:// access first as it is simpler without starting server,
    // BUT localstorage might be tricky with file:// in some browsers. 
    // Ideally we should use the file:// protocol but Puppeteer allows it.
    // However, let's check if the user is running XAMPP. The path C:\xampp... suggests it.
    // Let's rely on file:// for simplicity as we don't know if Apache is ON.

    const outputDir = path.join(__dirname, '../assets/img/manual');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    async function takeShot(urlName, saveName) {
        console.log(`Navigating to ${urlName}...`);
        await page.goto(`${baseUrl}/${urlName}`, { waitUntil: 'networkidle0' });

        // Wait a bit for animations
        await new Promise(r => setTimeout(r, 1000));

        const savePath = path.join(outputDir, saveName);
        await page.screenshot({ path: savePath });
        console.log(`Saved ${saveName}`);
    }

    try {
        // -------------------------------------
        // 1. LOGIN SCREEN
        // -------------------------------------
        // Clear session first just in case
        // Navigate first to establish origin
        await page.goto(`${baseUrl}/login.html`, { waitUntil: 'networkidle0' });

        // Clear session to ensure we see the login form
        await page.evaluate(() => {
            localStorage.clear();
        });
        await page.reload({ waitUntil: 'networkidle0' });

        // Wait for animations (box floating etc)
        await new Promise(r => setTimeout(r, 1000));

        const savePath = path.join(outputDir, '1_login.png');
        await page.screenshot({ path: savePath });
        console.log(`Saved 1_login.png`);

        // -------------------------------------
        // 2. DO LOGIN
        // -------------------------------------
        console.log('Performing login...');
        await page.type('#password', 'admin123'); // Admin role

        // Open the custom select to make it look interactive or just set value?
        // Let's just set the hidden select for stability
        await page.evaluate(() => {
            document.getElementById('rolUsuario').value = 'admin';
            // Also update the UI text if we want it to look "selected"
            document.getElementById('customSelectText').innerText = 'Administrador';
        });

        const btnLogin = await page.$('#btnLogin');
        await btnLogin.click();

        // Wait for redirect
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        console.log('Login completed.');

        // -------------------------------------
        // 3. DASHBOARD / COTIZATOR
        // -------------------------------------
        await new Promise(r => setTimeout(r, 2000)); // wait for potentially sidebar load
        await takeShot('cotizacion.html', '2_cotizador.png');

        // -------------------------------------
        // 3b. POPULATE TABLE & CAPTURE SUMMARY
        // -------------------------------------
        console.log('Populating summary table...');
        await page.evaluate(() => {
            // Simulate adding items to the table
            const tabla = document.querySelector('#tablaResumen tbody');
            if (tabla) {
                const row = `
                    <tr>
                        <td>Organización de Archivos</td>
                        <td>Alistamiento</td>
                        <td>Caja</td>
                        <td>10</td>
                        <td>$ 5,000</td>
                        <td>$ 50,000</td>
                        <td><button class="btn-delete">🗑️</button></td>
                    </tr>
                    <tr>
                        <td>Digitalización</td>
                        <td>Escaneo</td>
                        <td>Folio</td>
                        <td>500</td>
                        <td>$ 200</td>
                        <td>$ 100,000</td>
                        <td><button class="btn-delete">🗑️</button></td>
                    </tr>
                `;
                tabla.innerHTML = row;

                // Update totals if there are elements for it
                const subtotalEl = document.getElementById('subtotalGeneral');
                const totalEl = document.getElementById('totalFinal');
                if (subtotalEl) subtotalEl.innerText = '$ 150,000';
                if (totalEl) totalEl.innerText = '$ 150,000';
            }
        });
        await takeShot('cotizacion.html', '2b_tabla_resumen_llena.png');

        // Capture Sidebar specifically (maybe by hiding main content or cropping?)
        // For simplicity, we just take the shot, the user can see it left. 
        // But let's try to highlight it or maybe hover an item.
        await page.hover('.sidebar-menu li:first-child');
        await takeShot('cotizacion.html', '9_sidebar_uso.png');

        // -------------------------------------
        // 4. SIDEBAR MODULES
        // -------------------------------------
        await takeShot('suministros.html', '3_suministros.png');
        await takeShot('equipos.html', '4_equipos.png');
        await takeShot('funcionarios.html', '5_funcionarios.png');
        await takeShot('aliados.html', '6_aliados.png');

        // -------------------------------------
        // 5. EXPORT MODAL (Simulated)
        // -------------------------------------
        // We'll go back to cotizacion and open a modal if possible, 
        // or just leave it as is. 
        // Let's try to capture the "Textos Plantilla" page too
        await takeShot('textos_plantilla.html', '7_plantillas.png');

    } catch (e) {
        console.error('Error during capture:', e);
    } finally {
        await browser.close();
    }
})();
