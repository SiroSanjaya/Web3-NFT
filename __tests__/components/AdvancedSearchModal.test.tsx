import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdvancedSearchModal from '../../components/AdvancedSearchModal'

// Mock data
const mockCategories = ['Art', 'Gaming', 'Music', 'Sports', 'Photography']
const mockCollections = ['Bored Ape Yacht Club', 'CryptoPunks', 'Doodles', 'Azuki']

const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  onApplyFilters: jest.fn(),
  categories: mockCategories,
  collections: mockCollections,
}

describe('AdvancedSearchModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders when open', () => {
    render(<AdvancedSearchModal {...defaultProps} />)
    
    expect(screen.getByText('Advanced Search & Filters')).toBeInTheDocument()
    expect(screen.getByText('Basic Search')).toBeInTheDocument()
    expect(screen.getByText('Categories & Collections')).toBeInTheDocument()
    expect(screen.getByText('Attributes')).toBeInTheDocument()
    expect(screen.getByText('Price Range (ETH)')).toBeInTheDocument()
    expect(screen.getByText('Rarity')).toBeInTheDocument()
    expect(screen.getByText('Sort By')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<AdvancedSearchModal {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('Advanced Search & Filters')).not.toBeInTheDocument()
  })

  it('closes when backdrop is clicked', async () => {
    render(<AdvancedSearchModal {...defaultProps} />)
    
    const backdrop = screen.getByRole('presentation')
    await userEvent.click(backdrop)
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('closes when close button is clicked', async () => {
    render(<AdvancedSearchModal {...defaultProps} />)
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    await userEvent.click(closeButton)
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('handles basic search inputs', async () => {
    render(<AdvancedSearchModal {...defaultProps} />)
    
    const nameInput = screen.getByPlaceholderText('Search by name...')
    const descriptionInput = screen.getByPlaceholderText('Search in description...')
    
    await userEvent.type(nameInput, 'Test NFT')
    await userEvent.type(descriptionInput, 'Test description')
    
    expect(nameInput).toHaveValue('Test NFT')
    expect(descriptionInput).toHaveValue('Test description')
  })

  it('handles category selection', async () => {
    render(<AdvancedSearchModal {...defaultProps} />)
    
    const categorySelect = screen.getByDisplayValue('All Categories')
    await userEvent.click(categorySelect)
    
    const artOption = screen.getByText('Art')
    await userEvent.click(artOption)
    
    expect(categorySelect).toHaveValue('Art')
  })

  it('handles collection selection', async () => {
    render(<AdvancedSearchModal {...defaultProps} />)
    
    const collectionSelect = screen.getByDisplayValue('All Collections')
    await userEvent.click(collectionSelect)
    
    const baycOption = screen.getByText('Bored Ape Yacht Club')
    await userEvent.click(baycOption)
    
    expect(collectionSelect).toHaveValue('Bored Ape Yacht Club')
  })

  it('handles price range inputs', async () => {
    render(<AdvancedSearchModal {...defaultProps} />)
    
    const minPriceInput = screen.getByPlaceholderText('0.001')
    const maxPriceInput = screen.getByPlaceholderText('10.0')
    
    await userEvent.type(minPriceInput, '0.5')
    await userEvent.type(maxPriceInput, '5.0')
    
    expect(minPriceInput).toHaveValue(0.5)
    expect(maxPriceInput).toHaveValue(5.0)
  })

  it('handles rarity selection', async () => {
    render(<AdvancedSearchModal {...defaultProps} />)
    
    const raritySelect = screen.getByDisplayValue('All Rarities')
    await userEvent.click(raritySelect)
    
    const rareOption = screen.getByText('Rare')
    await userEvent.click(rareOption)
    
    expect(raritySelect).toHaveValue('Rare')
  })

  it('handles sort options', async () => {
    render(<AdvancedSearchModal {...defaultProps} />)
    
    const sortSelect = screen.getByDisplayValue('Newest First')
    await userEvent.click(sortSelect)
    
    const priceLowOption = screen.getByText('Price: Low to High')
    await userEvent.click(priceLowOption)
    
    expect(sortSelect).toHaveValue('price-low')
  })

  it('handles status checkboxes', async () => {
    render(<AdvancedSearchModal {...defaultProps} />)
    
    const onSaleCheckbox = screen.getByLabelText('On Sale Only')
    const hasOffersCheckbox = screen.getByLabelText('Has Offers')
    
    await userEvent.click(onSaleCheckbox)
    await userEvent.click(hasOffersCheckbox)
    
    expect(onSaleCheckbox).toBeChecked()
    expect(hasOffersCheckbox).toBeChecked()
  })

  it('adds and removes attributes', async () => {
    render(<AdvancedSearchModal {...defaultProps} />)
    
    const traitInput = screen.getByPlaceholderText('Trait (e.g., Background)')
    const valueInput = screen.getByPlaceholderText('Value (e.g., Blue)')
    const addButton = screen.getByText('Add')
    
    // Add attribute
    await userEvent.type(traitInput, 'Background')
    await userEvent.type(valueInput, 'Blue')
    await userEvent.click(addButton)
    
    // Check if attribute was added
    expect(screen.getByText('Background: Blue')).toBeInTheDocument()
    
    // Remove attribute
    const removeButton = screen.getByRole('button', { name: /remove/i })
    await userEvent.click(removeButton)
    
    // Check if attribute was removed
    expect(screen.queryByText('Background: Blue')).not.toBeInTheDocument()
  })

  it('resets all filters', async () => {
    render(<AdvancedSearchModal {...defaultProps} />)
    
    // Fill some filters
    const nameInput = screen.getByPlaceholderText('Search by name...')
    const minPriceInput = screen.getByPlaceholderText('0.001')
    
    await userEvent.type(nameInput, 'Test NFT')
    await userEvent.type(minPriceInput, '0.5')
    
    // Check if filters are filled
    expect(nameInput).toHaveValue('Test NFT')
    expect(minPriceInput).toHaveValue(0.5)
    
    // Reset filters
    const resetButton = screen.getByText('Reset All')
    await userEvent.click(resetButton)
    
    // Check if filters are cleared
    expect(nameInput).toHaveValue('')
    expect(minPriceInput).toHaveValue(null)
  })

  it('applies filters and closes modal', async () => {
    render(<AdvancedSearchModal {...defaultProps} />)
    
    // Fill some filters
    const nameInput = screen.getByPlaceholderText('Search by name...')
    await userEvent.type(nameInput, 'Test NFT')
    
    // Apply filters
    const applyButton = screen.getByText('Apply Filters')
    await userEvent.click(applyButton)
    
    // Check if onApplyFilters was called with correct data
    expect(defaultProps.onApplyFilters).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test NFT',
        description: '',
        category: '',
        collection: '',
        minPrice: '',
        maxPrice: '',
        rarity: '',
        attributes: [],
        sortBy: 'newest',
        onSale: false,
        hasOffers: false,
      })
    )
    
    // Check if modal was closed
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('validates attribute inputs before adding', async () => {
    render(<AdvancedSearchModal {...defaultProps} />)
    
    const addButton = screen.getByText('Add')
    
    // Try to add attribute without trait
    await userEvent.click(addButton)
    
    // Check if no attribute was added
    expect(screen.queryByText(/:/)).not.toBeInTheDocument()
    
    // Try to add attribute without value
    const traitInput = screen.getByPlaceholderText('Trait (e.g., Background)')
    await userEvent.type(traitInput, 'Background')
    await userEvent.click(addButton)
    
    // Check if no attribute was added
    expect(screen.queryByText(/Background:/)).not.toBeInTheDocument()
  })

  it('handles multiple attributes correctly', async () => {
    render(<AdvancedSearchModal {...defaultProps} />)
    
    const traitInput = screen.getByPlaceholderText('Trait (e.g., Background)')
    const valueInput = screen.getByPlaceholderText('Value (e.g., Blue)')
    const addButton = screen.getByText('Add')
    
    // Add first attribute
    await userEvent.type(traitInput, 'Background')
    await userEvent.type(valueInput, 'Blue')
    await userEvent.click(addButton)
    
    // Add second attribute
    await userEvent.type(traitInput, 'Eyes')
    await userEvent.type(valueInput, 'Green')
    await userEvent.click(addButton)
    
    // Check if both attributes are displayed
    expect(screen.getByText('Background: Blue')).toBeInTheDocument()
    expect(screen.getByText('Eyes: Green')).toBeInTheDocument()
  })

  it('maintains filter state between renders', () => {
    const { rerender } = render(<AdvancedSearchModal {...defaultProps} />)
    
    // Fill a filter
    const nameInput = screen.getByPlaceholderText('Search by name...')
    fireEvent.change(nameInput, { target: { value: 'Test NFT' } })
    
    // Re-render with same props
    rerender(<AdvancedSearchModal {...defaultProps} />)
    
    // Check if filter value is maintained
    expect(nameInput).toHaveValue('Test NFT')
  })

  it('handles keyboard navigation', async () => {
    render(<AdvancedSearchModal {...defaultProps} />)
    
    const nameInput = screen.getByPlaceholderText('Search by name...')
    const descriptionInput = screen.getByPlaceholderText('Search in description...')
    
    // Focus first input
    nameInput.focus()
    expect(nameInput).toHaveFocus()
    
    // Navigate to next input with Tab
    await userEvent.tab()
    expect(descriptionInput).toHaveFocus()
    
    // Navigate back with Shift+Tab
    await userEvent.tab({ shift: true })
    expect(nameInput).toHaveFocus()
  })

  it('handles form submission with Enter key', async () => {
    render(<AdvancedSearchModal {...defaultProps} />)
    
    const nameInput = screen.getByPlaceholderText('Search by name...')
    await userEvent.type(nameInput, 'Test NFT')
    
    // Submit with Enter key
    fireEvent.keyDown(nameInput, { key: 'Enter', code: 'Enter' })
    
    // Check if filters were applied
    expect(defaultProps.onApplyFilters).toHaveBeenCalled()
  })
})


