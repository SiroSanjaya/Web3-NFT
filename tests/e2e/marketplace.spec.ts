import { test, expect } from '@playwright/test'

test.describe('NFT Marketplace E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to marketplace before each test
    await page.goto('/marketplace')
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="marketplace-container"]', { timeout: 10000 })
  })

  test('should display marketplace with NFTs', async ({ page }) => {
    // Check if marketplace title is visible
    await expect(page.getByRole('heading', { name: /marketplace/i })).toBeVisible()
    
    // Check if NFT grid is displayed
    await expect(page.locator('[data-testid="nft-grid"]')).toBeVisible()
    
    // Check if at least one NFT card is visible
    await expect(page.locator('[data-testid="nft-card"]').first()).toBeVisible()
  })

  test('should filter NFTs by category', async ({ page }) => {
    // Click on category filter
    await page.click('[data-testid="category-filter"]')
    
    // Select Art category
    await page.click('text=Art')
    
    // Wait for filter to apply
    await page.waitForTimeout(1000)
    
    // Check if filtered results are displayed
    await expect(page.locator('[data-testid="filtered-results"]')).toBeVisible()
  })

  test('should search for NFTs', async ({ page }) => {
    // Click search button
    await page.click('[data-testid="search-button"]')
    
    // Type search query
    await page.fill('[data-testid="search-input"]', 'Bored Ape')
    
    // Submit search
    await page.press('[data-testid="search-input"]', 'Enter')
    
    // Wait for search results
    await page.waitForTimeout(1000)
    
    // Check if search results are displayed
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible()
  })

  test('should open advanced search modal', async ({ page }) => {
    // Click advanced search button
    await page.click('[data-testid="advanced-search-button"]')
    
    // Check if modal is visible
    await expect(page.locator('[data-testid="advanced-search-modal"]')).toBeVisible()
    
    // Check if modal title is correct
    await expect(page.getByText('Advanced Search & Filters')).toBeVisible()
  })

  test('should apply advanced filters', async ({ page }) => {
    // Open advanced search modal
    await page.click('[data-testid="advanced-search-button"]')
    
    // Fill price range
    await page.fill('[data-testid="min-price-input"]', '0.1')
    await page.fill('[data-testid="max-price-input"]', '10')
    
    // Select rarity
    await page.selectOption('[data-testid="rarity-select"]', 'Rare')
    
    // Apply filters
    await page.click('[data-testid="apply-filters-button"]')
    
    // Wait for modal to close
    await expect(page.locator('[data-testid="advanced-search-modal"]')).not.toBeVisible()
    
    // Check if filters are applied
    await expect(page.locator('[data-testid="active-filters"]')).toBeVisible()
  })

  test('should view NFT details', async ({ page }) => {
    // Click on first NFT card
    await page.click('[data-testid="nft-card"]:first-child')
    
    // Wait for NFT details page to load
    await page.waitForURL('**/nft/**')
    
    // Check if NFT details are displayed
    await expect(page.locator('[data-testid="nft-details"]')).toBeVisible()
    await expect(page.locator('[data-testid="nft-image"]')).toBeVisible()
    await expect(page.locator('[data-testid="nft-name"]')).toBeVisible()
    await expect(page.locator('[data-testid="nft-description"]')).toBeVisible()
  })

  test('should add NFT to favorites', async ({ page }) => {
    // Click favorite button on first NFT
    await page.click('[data-testid="favorite-button"]:first-child')
    
    // Wait for favorite action to complete
    await page.waitForTimeout(500)
    
    // Check if favorite button shows filled state
    await expect(page.locator('[data-testid="favorite-button"]:first-child')).toHaveAttribute('data-favorited', 'true')
  })

  test('should sort NFTs by price', async ({ page }) => {
    // Click sort dropdown
    await page.click('[data-testid="sort-dropdown"]')
    
    // Select price low to high
    await page.click('text=Price: Low to High')
    
    // Wait for sort to apply
    await page.waitForTimeout(1000)
    
    // Check if NFTs are sorted (first should have lower price than last)
    const firstPrice = await page.locator('[data-testid="nft-price"]:first-child').textContent()
    const lastPrice = await page.locator('[data-testid="nft-price"]:last-child').textContent()
    
    // Convert prices to numbers for comparison
    const firstPriceNum = parseFloat(firstPrice?.replace(/[^0-9.]/g, '') || '0')
    const lastPriceNum = parseFloat(lastPrice?.replace(/[^0-9.]/g, '') || '0')
    
    expect(firstPriceNum).toBeLessThanOrEqual(lastPriceNum)
  })

  test('should change view mode', async ({ page }) => {
    // Click grid view button
    await page.click('[data-testid="grid-view-button"]')
    
    // Check if grid view is active
    await expect(page.locator('[data-testid="grid-view-button"]')).toHaveAttribute('data-active', 'true')
    
    // Click list view button
    await page.click('[data-testid="list-view-button"]')
    
    // Check if list view is active
    await expect(page.locator('[data-testid="list-view-button"]')).toHaveAttribute('data-active', 'true')
  })

  test('should paginate through results', async ({ page }) => {
    // Check if pagination is visible
    await expect(page.locator('[data-testid="pagination"]')).toBeVisible()
    
    // Click next page button
    await page.click('[data-testid="next-page-button"]')
    
    // Wait for page change
    await page.waitForTimeout(1000)
    
    // Check if page number changed
    await expect(page.locator('[data-testid="current-page"]')).not.toHaveText('1')
  })

  test('should display trending NFTs section', async ({ page }) => {
    // Scroll to trending section
    await page.evaluate(selector => {
      document.querySelector(selector)?.scrollIntoView()
    }, '[data-testid="trending-section"]')
    
    // Check if trending section is visible
    await expect(page.locator('[data-testid="trending-section"]')).toBeVisible()
    
    // Check if trending NFTs are displayed
    await expect(page.locator('[data-testid="trending-nft"]').first()).toBeVisible()
  })

  test('should handle network switching', async ({ page }) => {
    // Click network switcher
    await page.click('[data-testid="network-switcher"]')
    
    // Select different network
    await page.click('text=Polygon')
    
    // Wait for network switch
    await page.waitForTimeout(2000)
    
    // Check if network indicator shows selected network
    await expect(page.locator('[data-testid="current-network"]')).toContainText('Polygon')
  })

  test('should connect wallet', async ({ page }) => {
    // Click connect wallet button
    await page.click('[data-testid="connect-wallet-button"]')
    
    // Check if wallet modal is visible
    await expect(page.locator('[data-testid="wallet-modal"]')).toBeVisible()
    
    // Select MetaMask
    await page.click('text=MetaMask')
    
    // Wait for wallet connection
    await page.waitForTimeout(2000)
    
    // Check if wallet is connected
    await expect(page.locator('[data-testid="wallet-address"]')).toBeVisible()
  })

  test('should create collection', async ({ page }) => {
    // Navigate to create collection page
    await page.goto('/create-collection')
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="create-collection-form"]', { timeout: 10000 })
    
    // Fill collection form
    await page.fill('[data-testid="collection-name-input"]', 'Test Collection')
    await page.fill('[data-testid="collection-description-input"]', 'A test collection for E2E testing')
    await page.selectOption('[data-testid="collection-category-select"]', 'Art')
    
    // Upload image
    await page.setInputFiles('[data-testid="collection-image-input"]', 'tests/fixtures/test-image.png')
    
    // Submit form
    await page.click('[data-testid="create-collection-button"]')
    
    // Wait for success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
  })

  test('should mint NFT', async ({ page }) => {
    // Navigate to create collection page
    await page.goto('/create-collection')
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="mint-nft-form"]', { timeout: 10000 })
    
    // Fill NFT form
    await page.fill('[data-testid="nft-name-input"]', 'Test NFT')
    await page.fill('[data-testid="nft-description-input"]', 'A test NFT for E2E testing')
    await page.fill('[data-testid="nft-price-input"]', '0.1')
    
    // Upload image
    await page.setInputFiles('[data-testid="nft-image-input"]', 'tests/fixtures/test-nft.png')
    
    // Submit form
    await page.click('[data-testid="mint-nft-button"]')
    
    // Wait for minting to complete
    await page.waitForSelector('[data-testid="minting-success"]', { timeout: 30000 })
    
    // Check if success message is displayed
    await expect(page.locator('[data-testid="minting-success"]')).toBeVisible()
  })

  test('should stake NFT', async ({ page }) => {
    // Navigate to staking page
    await page.goto('/staking')
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="staking-pools"]', { timeout: 10000 })
    
    // Select a staking pool
    await page.click('[data-testid="staking-pool"]:first-child')
    
    // Click stake button
    await page.click('[data-testid="stake-button"]')
    
    // Wait for staking modal
    await expect(page.locator('[data-testid="staking-modal"]')).toBeVisible()
    
    // Confirm staking
    await page.click('[data-testid="confirm-stake-button"]')
    
    // Wait for staking to complete
    await page.waitForSelector('[data-testid="staking-success"]', { timeout: 30000 })
    
    // Check if success message is displayed
    await expect(page.locator('[data-testid="staking-success"]')).toBeVisible()
  })

  test('should participate in auction', async ({ page }) => {
    // Navigate to marketplace
    await page.goto('/marketplace')
    
    // Find an NFT with auction
    await page.waitForSelector('[data-testid="auction-nft"]', { timeout: 10000 })
    
    // Click on auction NFT
    await page.click('[data-testid="auction-nft"]:first-child')
    
    // Wait for NFT details page
    await page.waitForSelector('[data-testid="auction-details"]', { timeout: 10000 })
    
    // Place a bid
    await page.fill('[data-testid="bid-amount-input"]', '0.2')
    await page.click('[data-testid="place-bid-button"]')
    
    // Wait for bid confirmation
    await page.waitForSelector('[data-testid="bid-confirmation"]', { timeout: 10000 })
    
    // Check if bid was placed successfully
    await expect(page.locator('[data-testid="bid-confirmation"]')).toBeVisible()
  })

  test('should handle errors gracefully', async ({ page }) => {
    // Navigate to non-existent page
    await page.goto('/non-existent-page')
    
    // Check if 404 page is displayed
    await expect(page.locator('[data-testid="404-page"]')).toBeVisible()
    
    // Check if error message is correct
    await expect(page.getByText(/page not found/i)).toBeVisible()
  })

  test('should maintain state on page refresh', async ({ page }) => {
    // Apply some filters
    await page.click('[data-testid="advanced-search-button"]')
    await page.fill('[data-testid="min-price-input"]', '0.1')
    await page.click('[data-testid="apply-filters-button"]')
    
    // Refresh page
    await page.reload()
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="marketplace-container"]', { timeout: 10000 })
    
    // Check if filters are still applied
    await expect(page.locator('[data-testid="active-filters"]')).toBeVisible()
  })

  test('should handle mobile responsiveness', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check if mobile menu is accessible
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible()
    
    // Open mobile menu
    await page.click('[data-testid="mobile-menu-button"]')
    
    // Check if mobile menu is displayed
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
    
    // Check if navigation items are visible
    await expect(page.locator('[data-testid="mobile-nav-item"]')).toBeVisible()
  })
})


