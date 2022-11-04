import Icons from './FooterIcons'

/**
 * General footer for the website
 */
function Footer(): JSX.Element {
    return(
        <div className="container"> 
            <footer className="d-flex flex-wrap justify-content-between align-items-center py-3"> 
                <span className="mb-4 mb-md-0"> 
                    Made with {Icons.Heart} by tpguy825 -  <a rel="noopener" target="_blank" href="https://twitter.com/tobypayneyt">{Icons.Twitter}</a> <a rel="noopener" target="_blank" href="https://youtube.com/verydankmemes">{Icons.Youtube}</a> <a rel="noopener" target="_blank" href="https://github.com/tpguy825">{Icons.Github}</a> - <a rel="noopener" target="_blank" href="https://github.com/tpguy825/react-website" className="footer-icon">{Icons.Code} Source Code</a>
                </span> 
            </footer> 
        </div>
    );
}

export default Footer;
