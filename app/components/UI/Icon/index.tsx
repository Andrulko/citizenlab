import * as React from 'react';

const getIcon = (name: string, className: string | undefined) => {
  switch (name) {
    case 'close': {
      return (
        <svg className={className} height="100%" viewBox="2 2.002 19.998 19.997">
          <path d="M19.07 4.93c-3.902-3.904-10.238-3.904-14.142 0-3.903 3.902-3.903 10.238 0 14.142 3.903 3.902 10.24 3.902 14.142 0 3.905-3.904 3.905-10.24 0-14.143zm-2.828 9.898l-1.414 1.414L12 13.414l-2.83 2.828-1.413-1.414L10.587 12l-2.83-2.83L9.17 7.758l2.83 2.83 2.828-2.83 1.414 1.414L13.414 12l2.828 2.828z" />
        </svg>
      );
    }
    case 'close2': {
      return (
        <svg className={className} height="100%" viewBox="0 0 15.414 15.414">
          <path d="M15.414 2.117L13.297 0l-5.59 5.59L2.117 0 0 2.117l5.59 5.59L0 13.297l2.117 2.117 5.59-5.59 5.59 5.59 2.117-2.117-5.59-5.59"/>
        </svg>
      );
    }
    case 'upload': {
      return (
        <svg className={className} height="100%" viewBox="0 0.621 79 53.713">
          <path d="M72.227 39.8C71.234 34.785 66.81 31 61.5 31c-4.215 0-7.867 2.392-9.697 5.885-4.383.473-7.803 4.185-7.803 8.7 0 4.833 3.916 8.75 8.75 8.75h18.96c4.023 0 7.29-3.27 7.29-7.294 0-3.85-2.997-6.97-6.773-7.24zm-7.81 4.325v5.834h-5.833v-5.835H54.21l7.29-7.29 7.29 7.29h-4.374zM27.378 11.803c0 2.73 2.243 4.97 4.978 4.97s4.978-2.24 4.978-4.97-2.244-4.97-4.978-4.97-4.978 2.24-4.978 4.97zm7.466 0c0 1.387-1.1 2.485-2.49 2.485s-2.488-1.098-2.488-2.485c0-1.387 1.1-2.485 2.49-2.485s2.488 1.098 2.488 2.485z" />
          <path d="M42.597 37.895h-2.833l-6.222-6.95 8.128-8.62 8.77 9.575c.562-.622 1.187-1.17 1.836-1.685l-9.673-10.57c-.255-.27-.62-.413-.99-.387-.32.018-.62.156-.837.388L31.87 29.08 18.98 14.697c-.28-.32-.707-.474-1.127-.408-.276.044-.53.182-.72.388L2.49 30.38V4.35c0-.71.533-1.244 1.244-1.244h48.533c.71 0 1.245.533 1.245 1.243V29.33c.79-.5 1.618-.932 2.488-1.276V4.35C56 2.305 54.313.62 52.267.62H3.733C1.687.62 0 2.306 0 4.35V36.65c0 2.044 1.687 3.728 3.733 3.728h37.392c.398-.884.89-1.718 1.472-2.485zm-38.864 0c-.71 0-1.245-.533-1.245-1.243v-2.62l15.536-16.657 18.395 20.52H3.732z" />
        </svg>
      );
    }
    case 'error': {
      return (
        <svg className={className} height="100%" viewBox="2 2 20 20">
          <path fill="none" d="M0 0h24v24H0V0z" />
          <path d="M11 15h2v2h-2zM11 7h2v6h-2z" />
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
        </svg>
      );
    }
    case 'checkmark': {
      return (
        <svg className={className} width="19" height="15" viewBox="0 0 19 15">
          <path d="M6.05 11.467L1.533 6.95 0 8.482l6.05 6.05 13-13L17.517 0z" fill="#FFF" fillRule="evenodd" />
        </svg>
      );
    }
    case 'dropdown': {
      return (
        <svg className={className} width="9" height="6" viewBox="0 0 9 6">
          <path fill="#A6A6A6" fillRule="evenodd" d="M7.939 0L4.5 3.439 1.061 0 0 1.061l4.5 4.5 4.5-4.5z" />
        </svg>
      );
    }
    case 'arrow-back': {
      return (
        <svg className={className} height="100%" viewBox="0 0 24 24" >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
        </svg>
      );
    }
    case 'plus': {
      return (
        <svg className={className} height="100%" viewBox="0 0 51 51">
          <path d="M0 19.89v11.118h19.631V51h11.634V31.008H51V19.89H31.265V0H19.63v19.89H0z" fill="#d70065" />
        </svg>
      );
    }
    case 'plus': {
      return (
        <svg className={className} height="100%" viewBox="0 0 51 51">
          <path d="M0 19.89v11.118h19.631V51h11.634V31.008H51V19.89H31.265V0H19.63v19.89H0z" fill="#d70065" />
        </svg>
      );
    }
    case 'add_circle': {
      return (
        <svg className={className} height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
        </svg>
      );
    }
    case 'comment': {
      return (
        <svg className={className} height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
          <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
      );
    }
    case 'upvote': {
      return (
        <svg className={className} fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"/>
        </svg>

      );
    }
    case 'downvote': {
      return(
        <svg className={className} fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>
        </svg>
      );
    }
    case 'idea': {
      return(
        <svg className={className} fill="#000000" height="24" viewBox="0 0 24 24">
          <defs><path d="M0 0h24v24H0V0z" id="a" /></defs><clipPath id="b"><use overflow="visible" /></clipPath><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" />
        </svg>
      );
    }
    default:
      return null;
  }
};

const Icon: React.SFC<IIcon> = ({ name, className }) => getIcon(name, className);

interface IIcon {
  name: string;
  className?: string;
}

export default Icon;
