/* eslint-disable no-restricted-globals */
import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

/**
 * Component for displaying a page in the notebook.
 * @param {object} props - Component props
 * @param {import('./App').Page} props.page - The page to display
 * @param {function} props.onChange - The function to call when the page content changes
 * @returns
 */
export default function Page({ page, onChange }) {
    return (
        <div className="flex-container flexFlowColumn">
            <div className="flex-container alignItemsCenter">
                <input placeholder="Enter a title..." className="text_pole flex1" type="text" value={page.title} onChange={(event) => onChange({ ...page, title: event.target.value })} />
                <i className="right_menu_button fa-solid fa-trash" onClick={() => confirm('Are you sure?') && onChange(null)}></i>
            </div>
            <ReactQuill placeholder="What's on your mind?" theme="snow" value={page.content} onChange={(content) => onChange({ ...page, content })} scrollingContainer={document.getElementById('notebookPanelHolder')} />
        </div>
    );
}
