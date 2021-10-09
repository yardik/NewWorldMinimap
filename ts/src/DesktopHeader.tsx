import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { OWWindow } from '@overwolf/overwolf-api-ts/dist';
import CloseIcon from './Icons/CloseIcon';
import MaximizeIcon from './Icons/MaximizeIcon';
import Minimizeicon from './Icons/MinimizeIcon';
import RestoreIcon from './Icons/RestoreIcon';
import { windowNames } from './OverwolfWindows/consts';
import { desktopAppTitle } from './OverwolfWindows/desktop/desktop';
import { makeStyles } from './theme';

const useStyles = makeStyles()(theme => ({
    root: {
        display: 'flex',

        background: theme.headerBackground,
        color: theme.headerColor,
    },
    draggable: {
        flexGrow: 1,

        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
    },
    controlButton: {
        width: 42,
        background: 'transparent',
        border: 'none',
        color: '#fff',

        outline: 'none',

        '&:hover': {
            background: theme.headerButtonHover,
        },

        '&:active': {
            background: theme.headerButtonPress,
        },

        '&:focus': {
            outline: 'none',
        },

        '& > svg': {
            width: 30,
            height: 30,
        },
    },
    close: {
        '&:hover': {
            background: theme.headerCloseHover,
        },
        '&:active': {
            background: theme.headerClosePress,
        },
    },
}));

export default function DesktopHeader() {
    const { classes } = useStyles();
    const [desktopWindow] = useState(() => {
        return new OWWindow(windowNames.desktop);
    });

    const draggable = useRef<HTMLDivElement | null>(null);
    const [maximized, setMaximized] = React.useState(false);

    useEffect(() => {
        if (draggable.current) {
            desktopWindow.dragMove(draggable.current);
        }
    }, [draggable.current]);

    useEffect(() => {
        async function handleResize() {
            const windowState = await desktopWindow.getWindowState();
            setMaximized(windowState.window_state === 'maximized');
        }

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    function handleMinimize() {
        desktopWindow.minimize();
    }

    function handleMaximizeRestore() {
        if (maximized) {
            desktopWindow.restore();
        } else {
            desktopWindow.maximize();
        }
        setMaximized(!maximized);
    }

    function handleClose() {
        desktopWindow.close();
    }

    return <header className={classes.root}>
        <div ref={draggable} className={classes.draggable} onDoubleClick={handleMaximizeRestore}>
            <span>{desktopAppTitle}</span>
        </div>
        <button className={clsx(classes.controlButton)} onClick={handleMinimize}>
            <Minimizeicon />
        </button>
        <button className={clsx(classes.controlButton)} onClick={handleMaximizeRestore}>
            {maximized
                ? <RestoreIcon />
                : <MaximizeIcon />
            }
        </button>
        <button className={clsx(classes.controlButton, classes.close)} onClick={handleClose}>
            <CloseIcon />
        </button>
    </header>;
}
