describe('Practice Software Testing Application Verification', () => {
    
    describe('Area 1: Sign up / Sign in', () => {
        it('User successfully signs in with valid credentials', async () => {
            await browser.url('/auth/login');
            
            await $('[data-test="email"]').setValue('customer@practicesoftwaretesting.com');
            await $('[data-test="password"]').setValue('welcome01');
            await $('[data-test="login-submit"]').click();
            
            await browser.waitUntil(
                async () => (await browser.getUrl()).includes('account'),
                { timeout: 5000, timeoutMsg: 'Expected URL to contain "account" after login' }
            );
            
            const pageTitle = await $('h1').getText();
            assert.equal(pageTitle, 'My account', 'Dashboard title did not match expected text');
        });
    });

    describe('Area 2: User Profile Update', () => {
    it('should update profile address details cleanly', async () => {
        await browser.url('/auth/login');
        await $('[data-test="email"]').setValue('customer@practicesoftwaretesting.com');
        await $('[data-test="password"]').setValue('welcome01');
        await $('[data-test="login-submit"]').click();
        
        await browser.waitUntil(async () => (await browser.getUrl()).includes('account'), { 
            timeout: 5000 
        });

        const userMenu = await $('[data-test="nav-menu"]'); 
        await userMenu.click();
        await browser.pause(500);
        
        const profileLink = await $('[data-test="nav-profile"]');
        await profileLink.waitForClickable();
        await profileLink.click();
        
        const addressInput = await $('[data-test="address"]');
        await addressInput.waitForDisplayed({ timeout: 5000 });
        
        await addressInput.clearValue();
        await addressInput.setValue('123 Automation Way');
        
        await $('[data-test="update-profile-submit"]').click();
        
        await browser.pause(1000); 
        const savedValue = await addressInput.getValue();
        
        chaiExpect(savedValue).to.equal('123 Automation Way');
    });
});

    describe('Area 3: Product details page', () => {
        it('User views detailed information for a specific tool', async () => {
            await browser.url('/');
            
            const pliersCard = await $('h5*=Combination Pliers');
            await pliersCard.click();
            
            const productName = await $('[data-test="product-name"]');
            await productName.waitForDisplayed();

            const nameText = await productName.getText();
            const productPrice = await $('[data-test="unit-price"]');
            const priceExists = await productPrice.isExisting();

            nameText.should.equal('Combination Pliers');
            priceExists.should.be.true;
        });
    });

    describe('Area 4: Basket', () => {
        it('User adds a product to the shopping cart', async () => {
            await browser.url('/');
            
            const pliersCard = await $('h5*=Pliers');
            await pliersCard.click();
            
            const increaseQtyBtn = await $('[data-test="increase-quantity"]');
            await increaseQtyBtn.click();
            
            await $('[data-test="add-to-cart"]').click();
            
            const cartBadge = await $('[data-test="cart-quantity"]');
            await cartBadge.waitForDisplayed();
            const badgeText = await cartBadge.getText();
            
            badgeText.should.equal('2');
        });
    });

    describe('Area 5: Favorite products', () => {
        it('User adds a product to their favorites list', async () => {
            await browser.url('/auth/login');
            await $('[data-test="email"]').setValue('customer@practicesoftwaretesting.com');
            await $('[data-test="password"]').setValue('welcome01');
            await $('[data-test="login-submit"]').click();
            await browser.waitUntil(async () => (await browser.getUrl()).includes('account'), { timeout: 5000 });

            await $('a.navbar-brand, [data-test="nav-home"]').click();
            await browser.pause(1000); 
            
            const pliersCard = await $('h5*=Pliers');
            await pliersCard.click();
            
            const favoriteIcon = await $('[data-test="add-to-favorites"], #add-to-favorites');
            await favoriteIcon.waitForDisplayed();
            await favoriteIcon.click();
            await browser.pause(1000); 
            
            const userMenu = await $('[data-test="nav-menu"]'); 
            await userMenu.click();
            await browser.pause(500); // Wait for dropdown to expand
            
            const favoritesLink = await $('[data-test="nav-my-favorites"]');
            await favoritesLink.waitForClickable();
            await favoritesLink.click();
            await browser.pause(1000);
            
            const favoriteItems = await $$('.card');
            assert.isAbove(favoriteItems.length, 0, 'Favorites list is empty after adding an item');
        });
    });

    describe('Area 6: Search for an exact product', () => {
        it('User searches for a specific product by name', async () => {
            await browser.url('/');
            
            const searchInput = await $('[data-test="search-query"]');
            await searchInput.setValue('Hammer');
            await $('[data-test="search-submit"]').click();

            await browser.pause(1000); 
            
            const firstProductTitle = await $('.card-title');
            const titleText = await firstProductTitle.getText();
            
            chaiExpect(titleText).to.include('Hammer');
        });
    });

    describe('Area 7: Filter and sort products', () => {
        it('User sorts products by price from lowest to highest', async () => {
            await browser.url('/');

            const sortDropdown = await $('[data-test="sort"]');
            await sortDropdown.selectByVisibleText('Price (Low - High)');

            await browser.pause(1500); 

            const prices = await $$('[data-test="product-price"]');
            const firstPrice = parseFloat((await prices[0].getText()).replace('$', ''));
            const secondPrice = parseFloat((await prices[1].getText()).replace('$', ''));

            assert.isAtMost(firstPrice, secondPrice, 'First item price is not lower or equal to the second item price');
        });
    });

    describe('Area 8: Product categories', () => {
        it('User filters products by specific category', async () => {
            await browser.url('/');
            
            const handToolsCheckbox = await $('label*=Hand Tools');
            await handToolsCheckbox.click();
            
            await browser.pause(1500);
            
            const products = await $$('.card');
            
            chaiExpect(products.length).to.be.above(0, 'No products were displayed after applying the filter');
        });
    });
});